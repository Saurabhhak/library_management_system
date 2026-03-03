// Express server configuration setup 
//  Load env variables
require("dotenv").config();
//  Import dependencies
const express = require("express");
const cors = require("cors");
const adminRoute = require("./route.js/adminRoute");
const app = express();
// frontend backend middleWare cors
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("server is listen API running");
});
const PORT = process.env.PORT || 5000;
app.use("/api/categories", require("./route.js/category.routes"));
app.use("/api/books", require("./route.js/book.routes"));
app.use("/api/admin", adminRoute);
app.listen(PORT, () => {
  console.log(`Server Running On http://localhost:${PORT}`);
});
