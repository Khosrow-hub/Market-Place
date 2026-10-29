const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    name: String,
    nameDari: String,
    image: String
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
      postalCode: { type: String, required: true }
    }
  },
  billingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
      postalCode: { type: String, required: true }
    }
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cod', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  notes: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  amazonOrderId: {
    type: String
  },
  alibabaOrderId: {
    type: String
  },
  source: {
    type: String,
    enum: ['amazon', 'alibaba', 'both'],
    required: true
  }
}, {
  timestamps: true
});

// Index for better performance
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ seller: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });

OrderSchema.methods.getOrderDetails = function() {
  return {
    id: this._id,
    orderNumber: this.orderNumber,
    user: this.user,
    seller: this.seller,
    products: this.products,
    shippingAddress: this.shippingAddress,
    billingAddress: this.billingAddress,
    paymentMethod: this.paymentMethod,
    paymentStatus: this.paymentStatus,
    orderStatus: this.orderStatus,
    subtotal: this.subtotal,
    tax: this.tax,
    shippingCost: this.shippingCost,
    discount: this.discount,
    total: this.total,
    currency: this.currency,
    notes: this.notes,
    trackingNumber: this.trackingNumber,
    estimatedDelivery: this.estimatedDelivery,
    deliveredAt: this.deliveredAt,
    amazonOrderId: this.amazonOrderId,
    alibabaOrderId: this.alibabaOrderId,
    source: this.source,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Order', OrderSchema);