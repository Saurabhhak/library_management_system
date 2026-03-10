// Express server configuration setup
//  Load env variables
require("dotenv").config();
//  Import dependencies
const express = require("express");
const cors = require("cors");
const adminRoute = require("./route.js/adminRoute");
const bookRoutes = require("./route.js/book.routes");
const categoryRoutes = require("./route.js/category.routes");
const metaRoutes = require("./route.js/metaRoutes");
const app = express();
// frontend backend middleWare cors
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("server is listen API running");
});
const PORT = process.env.PORT || 5000;
// API Routes
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/meta", metaRoutes);
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
