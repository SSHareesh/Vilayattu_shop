// queries/addressQueries.js

const getAddressesByUserId = `
  SELECT * FROM addresses 
  WHERE user_id = $1 
  ORDER BY address_id DESC;
`;

const addAddress = `
  INSERT INTO addresses (user_id, address_line1, city, state, postal_code, country, address_type)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

const deleteAddress = `
  DELETE FROM addresses 
  WHERE address_id = $1 AND user_id = $2
  RETURNING address_id;
`;

module.exports = {
  getAddressesByUserId,
  addAddress,
  deleteAddress,
};