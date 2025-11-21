const getCartByUserId = `
    SELECT ci.cart_item_id, p.product_id, p.name, p.price, p.image_url, ci.quantity
    FROM cart c
    JOIN cart_items ci ON c.cart_id = ci.cart_id
    JOIN products p ON ci.product_id = p.product_id
    WHERE c.user_id = $1;
`;

const findProductInCart = `
    SELECT ci.*
    FROM cart_items ci
    JOIN cart c ON ci.cart_id = c.cart_id
    WHERE c.user_id = $1 AND ci.product_id = $2;
`;

const addProductToCart = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    SELECT cart_id, $2, $3 FROM cart WHERE user_id = $1
    RETURNING *;
`;

const updateCartItemQuantity = `
    UPDATE cart_items
    SET quantity = $1
    WHERE cart_item_id = $2
    RETURNING *;
`;

const removeProductFromCart = `
    DELETE FROM cart_items
    WHERE cart_item_id = $1;
`;

const clearCart = `
    DELETE FROM cart_items
    WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1);
`;


module.exports = {
    getCartByUserId,
    findProductInCart,
    addProductToCart,
    updateCartItemQuantity,
    removeProductFromCart,
    clearCart,
};