const express = require("express");
const xlsx = require("xlsx");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(express.json());

// --- 1. PostgreSQL Connection ---

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME, 
  password: DB_PASSWORD, 
  port: DB_PORT,
});

// --- 2. Helper Function to Get or Create Categories ---
async function getOrCreateCategory(client, parentName, subName) {
  try {
    let parentId = null;

    if (parentName) {
      const parentRes = await client.query(
        "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING category_id",
        [parentName]
      );
      parentId = parentRes.rows[0].category_id;
    }

    if (subName) {
      const subRes = await client.query(
        "INSERT INTO categories (name, parent_category_id) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING category_id",
        [subName, parentId]
      );
      return subRes.rows[0].category_id;
    }

    return parentId;
  } catch (err) {
    console.error(`Error with category "${subName || parentName}":`, err.message);
    return null;
  }
}


// --- 3. Main Seeding Function with Transaction ---
async function seedProducts() {
  const client = await pool.connect();
  console.log("Database client connected.");

  try {
    const filePath = path.join(__dirname, 'vilayattu_products.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`Found ${rows.length} rows in the Excel file. Starting transaction...`);
    
    await client.query('BEGIN');

    for (const p of rows) {
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
          p.description,
          parseFloat(p.price),
          parseInt(p.stock_quantity),
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
    res.status(500).send(`<h1>❌ Error during seeding.</h1><p>Transaction was rolled back. Check server console for details.</p>`);
  }
});

// --- 5. Start the Server ---
app.listen(3000, () => {
  console.log("Seeding server running on http://localhost:3000");
  console.log("Visit http://localhost:3000/seed to start seeding the database.");
});