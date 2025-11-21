const db = require('../config/db');
const cartQueries = require('../queries/cartQueries');

const getCart = async (req, res) => {
    try {
        const { rows } = await db.query(cartQueries.getCartByUserId, [req.user.user_id]);
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.user_id;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    try {
        // Check if the product is already in the cart
        const existingItemResult = await db.query(cartQueries.findProductInCart, [userId, productId]);

        if (existingItemResult.rows.length > 0) {
            // If it exists, update the quantity
            const existingItem = existingItemResult.rows[0];
            const newQuantity = existingItem.quantity + quantity;
            const updatedItem = await db.query(cartQueries.updateCartItemQuantity, [newQuantity, existingItem.cart_item_id]);
            res.status(200).json(updatedItem.rows[0]);
        } else {
            // If it doesn't exist, add it
            const newItem = await db.query(cartQueries.addProductToCart, [userId, productId, quantity]);
            res.status(201).json(newItem.rows[0]);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCartItem = async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
    }
    
    try {
        const { rows } = await db.query(cartQueries.updateCartItemQuantity, [quantity, cartItemId]);
        if(rows.length === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

const removeItemFromCart = async (req, res) => {
    const { cartItemId } = req.params;
    try {
        await db.query(cartQueries.removeProductFromCart, [cartItemId]);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
};
