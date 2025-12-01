const pool = require('../config/db');
const orderQueries = require('../queries/orderQueries');
const cartQueries = require('../queries/cartQueries');

const addOrderItems = async (req, res) => {
    const { shippingAddressId } = req.body;
    const userId = req.user.user_id;

    const client = await pool.connect();

    try {
        // Get cart items for the user
        const cartItemsResult = await client.query(cartQueries.getCartByUserId, [userId]);
        const cartItems = cartItemsResult.rows;

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

        // Begin transaction
        await client.query('BEGIN');

        // Create the order
        const orderResult = await client.query(orderQueries.createOrder, [userId, totalAmount, shippingAddressId]);
        const orderId = orderResult.rows[0].order_id;

        // Insert order items and update stock
        for (const item of cartItems) {
            await client.query(orderQueries.addOrderItem, [orderId, item.product_id, item.quantity, item.price]);
            await client.query(orderQueries.updateProductStock, [item.quantity, item.product_id]);
        }

        // Clear the user's cart
        await client.query(cartQueries.clearCart, [userId]);

        // Commit transaction
        await client.query('COMMIT');

        res.status(201).json({ orderId, message: 'Order created successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order creation error:', error.message);
        res.status(500).json({ message: 'Server Error during checkout' });
    } finally {
        client.release();
    }
};

const getMyOrders = async (req, res) => {
    try {
        const { rows } = await pool.query(orderQueries.getUserOrders, [req.user.user_id]);
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getOrderById = async (req, res) => {
    try {
        const { rows } = await pool.query(orderQueries.getOrderDetails, [req.params.id, req.user.user_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
};
