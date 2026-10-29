"use strict";

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB connection is started only when this file is run directly. Keeping the
// Express app separate makes the API testable without opening a database
// connection as a side effect of importing it.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dari-marketplace');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// API Routes
app.use('/api/auth', require('../routes/auth.routes'));
app.use('/api/users', require('../routes/user.routes'));
app.use('/api/products', require('../routes/product.routes'));
app.use('/api/orders', require('../routes/order.routes'));
app.use('/api/admin', require('../routes/admin.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err.stack || err);
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal Server Error',
    status: err.statusCode || 500
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Dari Marketplace Backend running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
      });
    })
    .catch(() => process.exit(1));
}

module.exports = { app, connectDB };
