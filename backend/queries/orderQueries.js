const createOrder = `
    INSERT INTO orders (user_id, total_amount, shipping_address_id, status)
    VALUES ($1, $2, $3, 'Pending')
    RETURNING order_id;
`;

const addOrderItem = `
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
    VALUES ($1, $2, $3, $4);
`;

const updateProductStock = `
    UPDATE products
    SET stock_quantity = stock_quantity - $1
    WHERE product_id = $2;
`;

const getUserOrders = `
    SELECT order_id, total_amount, status, order_date
    FROM orders
    WHERE user_id = $1
    ORDER BY order_date DESC;
`;

const getOrderDetails = `
    SELECT o.order_id, o.total_amount, o.status, o.order_date,
           oi.quantity, oi.price_at_purchase,
           p.name as product_name, p.image_url,
           a.address_line1, a.city, a.state, a.postal_code
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    JOIN addresses a ON o.shipping_address_id = a.address_id
    WHERE o.order_id = $1 AND o.user_id = $2;
`;


module.exports = {
    createOrder,
    addOrderItem,
    updateProductStock,
    getUserOrders,
    getOrderDetails,
};
