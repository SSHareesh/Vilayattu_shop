const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, updateCartItem, removeItemFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// @route   /api/cart
router.route('/')
    .get(protect, getCart)
    .post(protect, addItemToCart);

router.route('/:cartItemId')
    .put(protect, updateCartItem)
    .delete(protect, removeItemFromCart);

module.exports = router;
