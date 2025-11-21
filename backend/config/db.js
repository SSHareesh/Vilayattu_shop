const { Pool } = require('pg');
require('dotenv').config(); // Adjust path if needed


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Is the DB pool object created?', !!pool);

module.exports = pool;
// Export the query function to be used throughout the application
// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };
