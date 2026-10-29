const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const generateOrderNumber = require('../utils/orderNumber');

exports.getOrders = catchAsync(async (req, res, next) => {
  const query = { user: req.user.id };

  const orders = await Order.find(query)
    .populate('user', 'fullName email')
    .populate('seller', 'fullName email')
    .populate('products.product', 'name images price')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: orders.length,
    data: {
      orders
    }
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'fullName email')
    .populate('seller', 'fullName email')
    .populate('products.product', 'name images price');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if user is the owner of the order or admin
  if (String(order.user._id || order.user) !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
    return next(new AppError('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      order
    }
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    products,
    shippingAddress,
    billingAddress,
    paymentMethod,
    notes,
    source
  } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return next(new AppError('At least one product is required', 400));
  }

  // Get product details and calculate totals
  const productDetails = [];
  let subtotal = 0;

  for (const item of products) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return next(new AppError('Each product quantity must be at least 1', 400));
    }
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product not found: ${item.product}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for product: ${product.name}`, 400));
    }

    const itemPrice = product.price * item.quantity;
    subtotal += itemPrice;

    productDetails.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      currency: product.currency,
      name: product.name,
      nameDari: product.nameDari,
      image: product.images[0],
      source: product.source
    });
  }

  // Calculate tax, shipping, and total
  const tax = subtotal * 0.1; // 10% tax
  const shippingCost = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + tax + shippingCost;

  // Get seller from the first product
  const firstProduct = await Product.findById(productDetails[0].product);
  if (!firstProduct) {
    return next(new AppError('Product not found', 404));
  }
  const seller = firstProduct.seller;
  const sources = new Set(productDetails.map(item => item.source));
  const orderSource = sources.size === 1 ? [...sources][0] : 'both';

  // Create order
  const order = new Order({
    orderNumber: await generateOrderNumber(),
    user: req.user.id,
    seller,
    products: productDetails,
    shippingAddress,
    billingAddress,
    paymentMethod,
    notes,
    source: ['amazon', 'alibaba'].includes(orderSource) ? orderSource : 'both',
    subtotal,
    tax,
    shippingCost,
    total,
    currency: 'USD'
  });

  await order.save();

  // Update product stock
  for (const item of products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order
    }
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if user is the owner of the order or admin
  if (String(order.user._id || order.user) !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
    return next(new AppError('Not authorized to cancel this order', 403));
  }

  if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
    return next(new AppError('Order cannot be cancelled at this stage', 400));
  }

  order.orderStatus = 'cancelled';
  await order.save();

  // Restore product stock
  for (const item of order.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: {
      order
    }
  });
});

exports.returnOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if user is the owner of the order or admin
  if (String(order.user._id || order.user) !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
    return next(new AppError('Not authorized to return this order', 403));
  }

  if (order.orderStatus !== 'delivered') {
    return next(new AppError('Order must be delivered to be returned', 400));
  }

  order.orderStatus = 'returned';
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order returned successfully',
    data: {
      order
    }
  });
});

module.exports = exports;
