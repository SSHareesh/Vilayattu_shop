const db = require('../config/db');
const productQueries = require('../queries/productQueries');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category, sortBy, order = 'asc' } = req.query;
  let query = productQueries.getAllProducts;
  const queryParams = [];

  // Filtering by category
  if (category) {
    query += ' WHERE c.name = $1';
    queryParams.push(category);
  }

  // Sorting
  if (sortBy) {
    // Whitelist columns to prevent SQL injection
    const allowedSortBy = ['price', 'name', 'created_at'];
    if (allowedSortBy.includes(sortBy)) {
      const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY p.${sortBy} ${sortOrder}`;
    }
  }

  try {
    const { rows } = await db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(productQueries.getProductById, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
