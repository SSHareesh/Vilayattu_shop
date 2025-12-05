const pool = require('../config/db');
const orderQueries = require('../queries/orderQueries');
const cartQueries = require('../queries/cartQueries');
// Import the email service
const { sendNewOrderEmail } = require('../services/emailServices');
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { shippingAddressId } = req.body;
    const userId = req.user.user_id;

    const client = await pool.connect();

    try {
        // 1. Get cart items
        const cartItemsResult = await client.query(cartQueries.getCartByUserId, [userId]);
        const cartItems = cartItemsResult.rows;

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'No items in cart' });
        }

        const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

        await client.query('BEGIN');

        // 2. Create the order
        const orderResult = await client.query(orderQueries.createOrder, [userId, totalAmount, shippingAddressId]);
        const orderId = orderResult.rows[0].order_id;

        // 3. Insert items & Update stock
        for (const item of cartItems) {
            await client.query(orderQueries.addOrderItem, [orderId, item.product_id, item.quantity, item.price]);
            await client.query(orderQueries.updateProductStock, [item.quantity, item.product_id]);
        }

        // 4. Clear cart
        await client.query(cartQueries.clearCart, [userId]);

        await client.query('COMMIT');

        // --- EMAIL NOTIFICATION LOGIC (After Commit) ---
        
        // We need the full address details to send in the email
        // We create a quick query here or you can add it to addressQueries.js
        const addressResult = await pool.query('SELECT * FROM addresses WHERE address_id = $1', [shippingAddressId]);
        const address = addressResult.rows[0];

        // Prepare the data packet for the email service
        const orderDetails = {
            orderId,
            user: req.user, // Middleware attaches this (has email, name)
            address: address,
            items: cartItems, // Contains name, quantity, price
            total: totalAmount
        };

        // Send the email (asynchronously - don't await so user doesn't wait)
        sendNewOrderEmail(orderDetails);

        // -----------------------------------------------

        res.status(201).json({ orderId, message: 'Order created successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Order Creation Error:', error.message);
        res.status(500).json({ message: 'Server Error during checkout' });
    } finally {
        client.release();
    }
};

// ... keep getMyOrders and getOrderById as they were ...
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