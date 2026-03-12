// Setup database connection using environment variables

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
}); 
pool.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));


module.exports = pool;
