const express = require("express");
const app = express();
require("dotenv").config();
const uid = require("uid").uid;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const { connection, dbQuery } = require("./database");

connection.query(`USE ${process.env.DB_DBID}`);

app.get("/api/products", async (req, res) => {
  try {
    let data = await dbQuery("SELECT * FROM `products`");
    res.json({ products: data[0], request: "success" });
  } catch (e) {
    res.status(400);
    res.json({ data: "Data failed to fetch", error: e.code });
  }
});
app.post("/api/products/new", async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const data = await connection
      .promise()
      .query(
        `INSERT INTO products(id,name,price,stock,category) VALUES ('${uid()}','${name}', '${price}', '${stock}', '${category}')`
      );
    res.json({ data_submited: data, status: "success" });
  } catch (e) {
    res.status(400);
    res.json({ data: "Something went wrong", error: e.code });
  }
});

app.delete("api/products/:id", async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
  }
});
app.get("/api/products/:category");

app.get("/api/users", async (req, res) => {
  try {
    let data = await connection.promise().query("SELECT * FROM users");
    res.json({ data: data[0], request: "success" });
  } catch (e) {
    res.status(400);
    res.json({ data: "Data failed to fetch", error: e.code });
  }
});

//creating user
app.post("/api/signup", async (req, res) => {
  //destructuring user details
  const { username, password, firstName, surname, email } = req.body;
  //if all details are available create a new user
  if ((username, password, firstName, surname, email)) {
    await connection.promise()
      .query(`INSERT INTO users (id,firstName, surname, email, username, password, isAdmin)
     VALUES ('${uid()}','${firstName}', '${surname}', '${email}', '${username}', '${password}', false )`);
    let userCreated = await connection
      .promise()
      .query(`SELECT * FROM users WHERE firstName = '${firstName}'`);
    res.json({ request: "success", user: userCreated });
  } else {
    console.log("error");
  }
});

app.listen(5000, () => {
  console.log("listening on port 5000");
});
