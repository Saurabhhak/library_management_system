const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  database: "library_db",
  password: "root",
});
module.exports = pool;
