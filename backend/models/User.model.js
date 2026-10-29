const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^.+@.+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  language: {
    type: String,
    default: 'dari',
    enum: ['dari', 'pashto', 'english']
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin', 'owner'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  verificationToken: String,
  verificationTokenExpires: Date,
  avatar: {
    type: String,
    default: ''
  },
  amazonId: {
    type: String,
    default: ''
  },
  alibabaId: {
    type: String,
    default: ''
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'change-this-development-secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Get user details without sensitive information
UserSchema.methods.getUserDetails = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    fullName: this.fullName,
    phoneNumber: this.phoneNumber,
    address: this.address,
    language: this.language,
    role: this.role,
    avatar: this.avatar,
    amazonId: this.amazonId,
    alibabaId: this.alibabaId,
    isVerified: this.isVerified,
    totalPurchases: this.totalPurchases,
    totalSpent: this.totalSpent,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', UserSchema);
