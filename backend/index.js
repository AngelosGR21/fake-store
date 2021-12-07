const express = require("express");
const app = express();
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_DBID,
});
// console.log(connection);
connection.query("SELECT * FROM `test`", (err, results, fields) => {
  console.log(results); // results contains rows returned by server
  // console.log(fields); // fields contains extra meta data about results, if available
});

app.get("/", (req, res) => {
  res.json({ testing: "Test" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
