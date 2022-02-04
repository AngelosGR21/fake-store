//express
const express = require("express");
const app = express();
//env
require("dotenv").config();
//cors
const cors = require("cors");
//database module
const { connection } = require("./database");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
connection.query(`USE ${process.env.DB_DBID}`);

//ROUTES IMPORT TESTING
const userRoutes = require("./routes/authentication");
const adminRoutes = require("./routes/admin");
const productRoutes = require("./routes/products");

//ROUTES TESTING
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("listening on port 5000");
});
