require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

/* _______________ MIDDLEWARE _______________ */
app.use(express.json());

app.use(
  cors({
    origin: ["https://localhost:3000", "https://library-management-system-jm0d.onrender.com"],
    credentials: true,
  }),
);

/* _______________ HEALTH CHECK _______________ */
app.get("/", (req, res) => {
  res.send("LMS Backend Running");
});

/* _______________ DB TEST _______________ */
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

/* _______________ ROUTES _______________ */
const routes = require("./routes");
app.use("/api", routes);

/* _______________ GLOBAL ERROR HANDLER _______________ */
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

/* _______________ SERVER _______________ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* _______________ ENV DEBUG _______________ */
console.log("ENV CHECK ----------------");
console.log("BREVO:", process.env.BREVO_API_KEY ? "OK" : "Missing");
console.log("SENDGRID:", process.env.SENDGRID_API_KEY ? "OK" : "Missing");
console.log("SMTP:", process.env.SMTP_USER ? "OK" : "Missing");
