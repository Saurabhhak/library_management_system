const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // required for Neon
  ssl: {
    rejectUnauthorized: false,
  },
});
// Test DB connection on startup
pool
  .connect()
  .then((client) => {
    console.log("PostgreSQL connected to Neon");
    // release client back to pool
    client.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

// Global pool error handler
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
  process.exit(-1);
});
module.exports = pool;