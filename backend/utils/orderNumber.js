const Order = require('../models/Order.model');

const generateOrderNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Get the last order number for today
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const lastOrder = await Order.findOne({
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastOrder && lastOrder.orderNumber) {
    const lastNumber = lastOrder.orderNumber.split('-')[1];
    sequence = parseInt(lastNumber) + 1;
  }

  return `ORD-${year}${month}${day}-${String(sequence).padStart(3, '0')}`;
};

module.exports = generateOrderNumber;