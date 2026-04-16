/* ___________________________ ENV LOAD ___________________________*/
const dotenv = require("dotenv");

/* Set NODE_ENV default FIRST */
const ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: ENV === "production" ? ".env.production" : ".env.development",
});

/* ___________________________ IMPORTS ___________________________*/
const express = require("express");
const cors = require("cors");

const app = express();

/* ___________________________ CONFIG ___________________________*/
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

/* ___________________________ MIDDLEWARE ___________________________*/
app.use(express.json());

/* Dynamic CORS (Production Ready) */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = ["http://localhost:3000", FRONTEND_URL];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
  }),
);

/* ___________________________ HEALTH CHECK ___________________________*/
app.get("/", (req, res) => {
  res.send(`LMS Backend Running (${process.env.NODE_ENV})`);
});

/* ___________________________ DB TEST ___________________________*/
app.get("/db-test", async (req, res) => {
  try {
    const { rows } = await require("./config/db").query("SELECT NOW()");
    res.json({
      success: true,
      time: rows[0],
    });
  } catch (error) {
    console.error("DB ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/* ___________________________ ROUTES ___________________________*/
const routes = require("./routes");
app.use("/api", routes);

/* ___________________________ GLOBAL ERROR ___________________________*/
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

/* ___________________________ SERVER ___________________________*/
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
});

console.log("__________________________________________________")
console.log("ENV FILE:", ENV);
console.log("FRONTEND:", process.env.FRONTEND_URL);
/* ___________________________ ENV DEBUG ___________________________*/
console.log("------ ENV CHECK ------");
console.log("BREVO:", process.env.BREVO_API_KEY ? "OK" : "Missing");
console.log("SENDGRID:", process.env.SENDGRID_API_KEY ? "OK" : "Missing");
console.log("SMTP:", process.env.SMTP_USER ? "OK" : "Missing");
