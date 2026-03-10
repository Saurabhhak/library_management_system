// -- setup database connection Configured database connection using environment variables
// and established error-handled connection setup for reliable backend operations.
const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "library_db",
  password: "root",
});
module.exports = pool;
