// const db = require('../config/db');
// console.log("DEBUG: What is the imported pool in authController?", pool);

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const userQueries = require('../queries/userQueries');



// // Function to generate JWT
// const generateToken = (user) => {
//   return jwt.sign({ user }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// const registerUser = async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).json({ message: 'Please add all fields' });
//   }

//   try {
//     // Check if user exists
//     const userExists = await db.query(userQueries.findUserByEmail, [email]);
//     if (userExists.rows.length > 0) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const password_hash = await bcrypt.hash(password, salt);

//     // Start a transaction
//     const client = await db.pool.connect();
//     try {
//         await client.query('BEGIN');

//         // Create user
//         const newUserResult = await client.query(userQueries.createUser, [firstName, lastName, email, password_hash]);
//         const newUser = newUserResult.rows[0];

//         // Create a cart for the new user
//         await client.query(userQueries.createCartForUser, [newUser.user_id]);

//         await client.query('COMMIT');
        
//         // Respond with token
//         res.status(201).json({
//             token: generateToken(newUser),
//             user: newUser
//         });

//     } catch (error) {
//         await client.query('ROLLBACK');
//         throw error;
//     } finally {
//         client.release();
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// };

// // @desc    Authenticate a user
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Please provide email and password' });
//     }

//     try {
//         const result = await db.query(userQueries.findUserByEmail, [email]);
//         const user = result.rows[0];

//         if (user && (await bcrypt.compare(password, user.password_hash))) {
//             const userPayload = {
//                 user_id: user.user_id,
//                 email: user.email,
//                 first_name: user.first_name,
//                 last_name: user.last_name
//             };

//             res.json({
//                 token: generateToken(userPayload),
//                 user: userPayload
//             });
//         } else {
//             res.status(400).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Server error during login' });
//     }
// };

// module.exports = {
//   registerUser,
//   loginUser,
// };


// controllers/authController.js

const pool = require('../config/db');

// --- DEBUGGING PROBE ---
// This will show us what is actually being imported from db.js
console.log("DEBUG authController: Imported value from db.js:", pool);

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userQueries = require('../queries/userQueries');

// --- Rest of your controller code ---

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const client = await pool.connect();
    try {
      // Check if user already exists
      const userExists = await client.query(userQueries.findUserByEmail, [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = await client.query(userQueries.createUser, [
        firstName,
        lastName,
        email,
        passwordHash,
      ]);

      // Create a cart for the new user
      await client.query(userQueries.createCartForUser, [newUser.rows[0].user_id]);

      const user = newUser.rows[0];

      res.status(201).json({
        user,
        token: generateToken(user),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query(userQueries.findUserByEmail, [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Remove password hash from the user object before sending it back
      delete user.password_hash;

      res.json({
        user,
        token: generateToken(user),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};


module.exports = {
  registerUser,
  loginUser,
};

