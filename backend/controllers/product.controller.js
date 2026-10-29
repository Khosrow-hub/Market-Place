const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = { isActive: true };

  // Category filter
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Source filter (amazon, alibaba, both)
  if (req.query.source) {
    query.source = req.query.source;
  }

  // Search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  const products = await Product.find(query)
    .populate('category', 'name')
    .populate('seller', 'fullName username')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    results: products.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: {
      products
    }
  });
});

exports.getFeaturedProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name')
    .populate('seller', 'fullName username')
    .limit(10)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: products.length,
    data: {
      products
    }
  });
});

exports.searchProducts = catchAsync(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new AppError('Search query is required', 400));
  }

  const products = await Product.find({
    isActive: true,
    $text: { $search: q }
  })
    .populate('category', 'name')
    .populate('seller', 'fullName username')
    .limit(20)
    .sort({ rating: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    results: products.length,
    data: {
      products,
      query: q
    }
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name')
    .populate('seller', 'fullName username email');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      product
    }
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category || !category.isActive) {
    return next(new AppError('Category not found', 404));
  }

  const products = await Product.find({ category: category._id, isActive: true })
    .populate('category', 'name nameDari')
    .populate('seller', 'fullName username')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: products.length,
    data: { products }
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    nameDari,
    description,
    descriptionDari,
    price,
    currency,
    images,
    category,
    subCategory,
    amazonProductId,
    alibabaProductId,
    amazonUrl,
    alibabaUrl,
    source,
    stock,
    condition,
    tags,
    specifications,
    location,
    shippingInfo,
    returnPolicy
  } = req.body;

  // Validate category exists
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    return next(new AppError('Category not found', 404));
  }

  // Create product
  const product = new Product({
    name,
    nameDari,
    description,
    descriptionDari,
    price,
    currency,
    images,
    category,
    subCategory,
    seller: req.user.id,
    amazonProductId,
    alibabaProductId,
    amazonUrl,
    alibabaUrl,
    source,
    stock,
    condition,
    tags,
    specifications,
    location,
    shippingInfo,
    returnPolicy
  });

  await product.save();

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: {
      product
    }
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Authorize before mutation; the prior implementation updated the document
  // before it checked its owner.
  if (product.seller.toString() !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
    return next(new AppError('Not authorized to update this product', 403));
  }

  const allowedFields = [
    'name', 'nameDari', 'description', 'descriptionDari', 'price', 'currency',
    'images', 'category', 'subCategory', 'amazonProductId', 'alibabaProductId',
    'amazonUrl', 'alibabaUrl', 'source', 'stock', 'condition', 'tags',
    'specifications', 'location', 'shippingInfo', 'returnPolicy', 'isFeatured'
  ];
  allowedFields.forEach(field => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) product[field] = req.body[field];
  });
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: {
      product
    }
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Check if user is the seller or admin
  if (product.seller.toString() !== req.user.id && !['admin', 'owner'].includes(req.user.role)) {
    return next(new AppError('Not authorized to delete this product', 403));
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

module.exports = exports;
