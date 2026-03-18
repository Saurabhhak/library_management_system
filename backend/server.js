require("dotenv").config();
const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/admin.routes");
const bookRoutes = require("./routes/book.routes");
const categoryRoutes = require("./routes/category.routes");
const metaRoutes = require("./routes/meta.routes");
const passwordRoutes = require("./routes/password.routes");

const app = express();

/* Middleware */

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://lms-frontend-35yk.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

/* Health Check */

app.get("/", (req, res) => {
  res.send("LMS Backend Running");
});

/* DB Test */

app.get("/db-test", async (req, res) => {
  const { rows } = await require("./config/db").query("SELECT NOW()");
  res.json(rows[0]);
});

/* Routes */

app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/password", passwordRoutes);

/* Server */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
