const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const addressRoutes = require('./routes/addressRoutes')

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Basic Route ---
app.get('/', (req, res) => {
  res.send('Welcome to the Vilayattu Shop API!');
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses',addressRoutes);


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

