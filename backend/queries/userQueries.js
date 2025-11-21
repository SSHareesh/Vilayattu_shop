const findUserByEmail = 'SELECT * FROM users WHERE email = $1';

// Query to create a new user and return their essential details
const createUser = `
  INSERT INTO users (first_name, last_name, email, password_hash)
  VALUES ($1, $2, $3, $4)
  RETURNING user_id, email, first_name, last_name;
`;

// Query to create a cart for a new user
const createCartForUser = 'INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id;';


module.exports = {
  findUserByEmail,
  createUser,
  createCartForUser
};
