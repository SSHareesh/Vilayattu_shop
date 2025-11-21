const getAllProducts = `
  SELECT p.*, c.name as category_name
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
`;

// Query to find a single product by its ID
const getProductById = `
  SELECT p.*, c.name as category_name
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.category_id
  WHERE p.product_id = $1;
`;

module.exports = {
  getAllProducts,
  getProductById,
};
