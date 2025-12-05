const express = require("express");
const xlsx = require("xlsx");
const { Pool } = require("pg");
const path = require("path");
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());

// --- 1. PostgreSQL Connection ---
// FIX: Access variables via process.env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // Ensure this matches your .env key (DB_DATABASE or DB_NAME)
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  
});

// --- 2. Helper Function to Get or Create Categories ---
async function getOrCreateCategory(client, parentName, subName) {
  try {
    let parentId = null;

    // Handle Parent Category (e.g., "Outdoor")
    if (parentName) {
      // Check if exists first to get ID, or insert if not
      let parentRes = await client.query("SELECT category_id FROM categories WHERE name = $1", [parentName]);
      
      if (parentRes.rows.length > 0) {
        parentId = parentRes.rows[0].category_id;
      } else {
        const insertRes = await client.query(
          "INSERT INTO categories (name) VALUES ($1) RETURNING category_id",
          [parentName]
        );
        parentId = insertRes.rows[0].category_id;
      }
    }

    // Handle Subcategory (e.g., "Cricket")
    if (subName) {
        let subRes = await client.query("SELECT category_id FROM categories WHERE name = $1", [subName]);
        
        if (subRes.rows.length > 0) {
            return subRes.rows[0].category_id;
        } else {
            const insertRes = await client.query(
                "INSERT INTO categories (name, parent_category_id) VALUES ($1, $2) RETURNING category_id",
                [subName, parentId]
            );
            return insertRes.rows[0].category_id;
        }
    }

    return parentId;
  } catch (err) {
    // If error is duplicate key (race condition), try fetching again
    if (err.code === '23505') { // unique_violation
        console.log(`Duplicate found for ${subName || parentName}, fetching existing ID...`);
        const res = await client.query("SELECT category_id FROM categories WHERE name = $1", [subName || parentName]);
        return res.rows[0]?.category_id;
    }
    console.error(`Error with category "${subName || parentName}":`, err.message);
    return null;
  }
}


// --- 3. Main Seeding Function with Transaction ---
async function seedProducts() {
  // Use a client from the pool to ensure transaction isolation
  const client = await pool.connect();
  console.log("Database client connected.");

  try {
    const filePath = path.join(__dirname, 'vilayattu_products.xlsx');
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`Found ${rows.length} rows in the Excel file. Starting transaction...`);
    
    await client.query('BEGIN');

    for (const p of rows) {
      // Ensure required fields exist
      if (!p.product_name || !p.price) {
          console.warn(`Skipping row with missing name or price.`);
          continue;
      }

      const categoryId = await getOrCreateCategory(client, p.category, p.subcategory);

      if (!categoryId) {
        console.warn(`⚠️ Skipping product "${p.product_name}" due to category error.`);
        continue;
      }

      await client.query(
        `INSERT INTO products (name, description, price, stock_quantity, category_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          p.product_name,
          p.description || '',
          parseFloat(p.price),
          parseInt(p.stock_quantity) || 0,
          categoryId,
        ]
      );
      console.log(`  -> Queued for insert: ${p.product_name}`);
    }

    await client.query('COMMIT');
    console.log("✅ Transaction committed! All data has been saved.");

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("\n❌ An error occurred. Transaction has been rolled back.", err);
    throw err;
  } finally {
    client.release();
    console.log("Database client released.");
  }
}

// --- 4. API Endpoint to Trigger the Seeding ---
app.get("/seed", async (req, res) => {
  try {
    await seedProducts();
    res.status(200).send("<h1>✅ Seeding complete!</h1><p>Check your database and console logs.</p>");
  } catch (err) {
    res.status(500).send(`<h1>❌ Error during seeding.</h1><p>${err.message}</p>`);
  }
});

// --- 5. Start the Server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Seeding server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/seed to start seeding the database.`);
});