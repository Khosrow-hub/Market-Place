const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authController = require('../controllers/auth.controller');

router.use(authController.protect);

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.patch('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/return', orderController.returnOrder);

module.exports = router;
