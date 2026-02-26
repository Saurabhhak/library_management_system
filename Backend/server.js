//  Load env variables
require("dotenv").config();
//  Import dependencies
const express = require("express");
const cors = require("cors");
const adminRoute = require("./route.js/adminRoute");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("server is listen");
});
const PORT = process.env.PORT || 5000;
app.use("/api/admin", adminRoute);
app.listen(PORT, () => {
  console.log(`Server Running On http://localhost:${5000}`);
});
