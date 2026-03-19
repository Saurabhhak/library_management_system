require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes"); // Route aggregator (routes/index.js)

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://lms-frontend-35yk.onrender.com"],
    credentials: true,
  }),
);

/* -------------------- Server Running Check -------------------- */
app.get("/", (req, res) => {
  res.send("LMS Backend Running");
});

/* -------------------- DB Test -------------------- */
app.get("/db-test", async (req, res) => {
  try {
    const { rows } = await require("./config/db").query("SELECT NOW()");
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
app.use("/api", routes);

/* -------------------- Server -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* -------------------- ENV Debug (optional) -------------------- */
console.log(
  "BREVO_API_KEY:",
  process.env.BREVO_API_KEY ? "Loaded " : "Missing ",
);

console.log("SENDER_EMAIL:", process.env.BREVO_SENDER_EMAIL || "Not set ");
