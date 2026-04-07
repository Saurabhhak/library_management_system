require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("./config/googleAuth");
const routes = require("./routes");
const db = require("./config/db");

const app = express();

/* -------------------- Middleware -------------------- */
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://lms-frontend-35yk.onrender.com"],
    credentials: true,
  }),
);

// Passport middleware (Google OAuth)
app.use(passport.initialize());

/* -------------------- Server Check -------------------- */
app.get("/", (req, res) => {
  res.send("LMS Backend Running");
});

/* -------------------- DB Test -------------------- */
app.get("/db-test", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT NOW()");
    res.json({
      success: true,
      time: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/* -------------------- API Routes -------------------- */
app.use("/api", require("./routes"));

/* -------------------- Server -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* -------------------- ENV Debug -------------------- */
console.log(
  "GOOGLE_CLIENT_ID:",
  process.env.GOOGLE_CLIENT_ID ? "Loaded" : "Missing",
);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");
