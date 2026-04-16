const { Pool } = require("pg");

/* ______________________ ENV */
const ENV = process.env.NODE_ENV || "development";

/* ______________________ CONFIG */
let poolConfig;

if (ENV === "production") {
  /* ____________ Neon DB (Production) */
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  /* ____________ Local PostgreSQL (Development) */
  poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

/* ______________________ SAFETY CHECK */
if (!poolConfig) {
  throw new Error("Database configuration missing!");
}

/* ______________________ POOL */
const pool = new Pool(poolConfig);

/* ______________________ CONNECTION TEST */
pool
  .connect()
  .then((client) => {
    console.log(
      `DB Connected With (${ENV === "production" ? "Neon" : "Local PostgreSQL"})`
    );
    client.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

module.exports = pool;