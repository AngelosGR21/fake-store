const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_DBID,
});

const dbQuery = (queryString) => {
  return connection.promise().query(queryString);
};

module.exports = { connection, dbQuery };
