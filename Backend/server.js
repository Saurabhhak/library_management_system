const express = require("express");
const cors = require("cors");
const adminRoute = require("./route.js/adminRoute");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/",(req, res) => {
  res.send("server is listen");
});
app.use("/api/admin", adminRoute);
app.listen(5000, () => {
  console.log(`Server Running On http://localhost:${5000}`);
});
