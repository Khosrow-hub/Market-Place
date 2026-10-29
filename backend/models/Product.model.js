const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  nameDari: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  descriptionDari: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'AFN', 'EUR']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amazonProductId: {
    type: String,
    default: null
  },
  alibabaProductId: {
    type: String,
    default: null
  },
  amazonUrl: {
    type: String
  },
  alibabaUrl: {
    type: String
  },
  source: {
    type: String,
    enum: ['amazon', 'alibaba', 'both'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'new'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  location: {
    city: String,
    country: String
  },
  shippingInfo: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    estimatedDelivery: String
  },
  returnPolicy: {
    type: String,
    default: '30 days return policy'
  }
}, {
  timestamps: true
});

// Index for better search performance
ProductSchema.index({ name: 'text', description: 'text', 'nameDari': 'text', 'descriptionDari': 'text' });
ProductSchema.index({ category: 1, isActive: -1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

ProductSchema.methods.getProductDetails = function() {
  return {
    id: this._id,
    name: this.name,
    nameDari: this.nameDari,
    description: this.description,
    descriptionDari: this.descriptionDari,
    price: this.price,
    currency: this.currency,
    images: this.images,
    category: this.category,
    subCategory: this.subCategory,
    seller: this.seller,
    amazonProductId: this.amazonProductId,
    alibabaProductId: this.alibabaProductId,
    amazonUrl: this.amazonUrl,
    alibabaUrl: this.alibabaUrl,
    source: this.source,
    stock: this.stock,
    condition: this.condition,
    isActive: this.isActive,
    isFeatured: this.isFeatured,
    rating: this.rating,
    reviewCount: this.reviewCount,
    tags: this.tags,
    specifications: this.specifications,
    location: this.location,
    shippingInfo: this.shippingInfo,
    returnPolicy: this.returnPolicy,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Product', ProductSchema);