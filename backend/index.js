const express = require("express");
const app = express();
require("dotenv").config();
const uid = require("uid").uid;
const cors = require("cors");
const bcrypt = require("bcrypt");

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

//creating user !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/api/signup", async (req, res) => {
  //destructuring user details
  const { username, password, firstName, surname, email } = req.body;
  //if all details are available create a new user
  if ((username, password, firstName, surname, email)) {
    //checking if username is already being used
    let usernameCheck = await connection
      .promise()
      .query(`SELECT * FROM users WHERE username = '${username}'`);
    //checking if email is already being used
    let emailCheck = await connection
      .promise()
      .query(`SELECT * FROM users WHERE email = '${email}'`);
    //if the length is  0 = username is available else username is not available
    if (!usernameCheck[0].length && !emailCheck[0].length) {
      //hashing password so we can store it in the db
      let hash = await bcrypt.hash(password, 15);
      //querying into the db and creating user
      await connection.promise()
        .query(`INSERT INTO users (id,firstName, surname, email, username, password, isAdmin)
     VALUES ('${uid()}','${firstName}', '${surname}', '${email}', '${username}', '${hash}', false )`);
      let userCreated = await connection
        .promise()
        .query(`SELECT * FROM users WHERE firstName = '${firstName}'`);
      res.json({ request: "success", user: userCreated });
    } else {
      //if username and email are in use
      if (usernameCheck[0].length && emailCheck[0].length) {
        return res.status(406).json({
          request: "failed",
          message: "Username and email are already being used",
        });
      }
      //if only username is in use
      if (usernameCheck[0].length) {
        return res.status(406).json({
          request: "failed",
          message: "Username is taken",
        });
      }
      //if only email is in use
      if (emailCheck[0].length) {
        return res.status(406).json({
          request: "failed",
          message: "Email is already being used",
        });
      }
    }
  } else {
    res.status(500).json({
      request: "failed",
      message: "Something went wrong, please try again later",
    });
  }
}); //creating user !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

app.listen(5000, () => {
  console.log("listening on port 5000");
});
