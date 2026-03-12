require("dotenv").config();
const express = require("express");
const cors = require("cors");
const adminRoute = require("./routes/admin.routes");
const bookRoutes = require("./routes/book.routes");
const categoryRoutes = require("./routes/category.routes");
const metaRoutes = require("./routes/meta.routes");
const passwordRoutes = require("./routes/password.routes");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Server Running");
});

/* API Routes */

app.use("/api/admin", adminRoute);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/meta", metaRoutes);

/* Password Reset APIs */
app.use("/api/password", passwordRoutes);
// Gets the port number from environment variables 
// (used in production servers) =  process.env.PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
