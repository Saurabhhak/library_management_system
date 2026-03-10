// Express server configuration setup
//  Load env variables
require("dotenv").config();
//  Import dependencies
const express = require("express");
const cors = require("cors");
const adminRoute = require("./routes/admin.routes");
const bookRoutes = require("./routes/book.routes");
const categoryRoutes = require("./routes/category.routes");
const metaRoutes = require("./routes/meta.routes");
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
