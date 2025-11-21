const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// @route   /api/orders
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, getMyOrders);
    
router.route('/:id').get(protect, getOrderById);

module.exports = router;