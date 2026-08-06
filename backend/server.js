"use strict";
const dotenv = require("dotenv");
const ENV = process.env.NODE_ENV || "development";
dotenv.config({
  path: ENV === "production" ? ".env.production" : ".env.development",
});

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (ENV === "production") app.set("trust proxy", 1);

/* ── Security headers ── */
app.use(helmet());

app.use(express.json());
/* NOTE: cookie-parser hata diya — ab auth cookies pe depend nahi karta.
   Access/refresh tokens Authorization header aur request body se aate hain. */

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowedOrigins = ["http://localhost:3000", FRONTEND_URL];
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"), false);
    },
    // credentials:true sirf cookies ke liye zaroori tha — header-based
    // JWT me iski zaroorat nahi, isliye hata diya (simpler CORS = fewer
    // browser edge cases like SameSite/domain mismatches).
  }),
);

/* ── Brute-force protection sirf sensitive auth endpoints pe ── */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again later." },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/send-otp", authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

/* ── Health check ── */
app.get("/", (req, res) =>
  res.send(`LMS Backend Running (${process.env.NODE_ENV})`),
);

app.get("/db-test", async (req, res) => {
  try {
    const { rows } = await require("./config/db").query("SELECT NOW()");
    res.json({ success: true, time: rows[0] });
  } catch (error) {
    console.error("DB ERROR:", error);
    res
      .status(500)
      .json({ success: false, message: "Database connection failed" });
  }
});

/* ── Routes ── */
app.use("/api", require("./routes"));

app.use("/api", (req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);

app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: ENV === "production" ? "Internal Server Error" : err.message,
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Mode: ${ENV}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => process.exit(0));
});
