// controllers/addressController.js

const pool = require('../config/db');
const addressQueries = require('../queries/addressQueries');

// @desc    Get all addresses for logged in user
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { rows } = await pool.query(addressQueries.getAddressesByUserId, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Server error fetching addresses' });
  }
};

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
  const { address_line1, city, state, postal_code, country, address_type } = req.body;
  const userId = req.user.user_id;

  if (!address_line1 || !city || !state || !postal_code || !country) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    const { rows } = await pool.query(addressQueries.addAddress, [
      userId,
      address_line1,
      city,
      state,
      postal_code,
      country,
      address_type || 'Home'
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error adding address' });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.user_id;
    
    const { rowCount } = await pool.query(addressQueries.deleteAddress, [addressId, userId]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Address not found or not authorized' });
    }
    
    res.json({ message: 'Address removed' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error deleting address' });
  }
};

module.exports = {
  getAddresses,
  addAddress,
  deleteAddress
};