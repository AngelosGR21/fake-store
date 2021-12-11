const express = require("express");
const app = express();
require("dotenv").config();

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
app.post("api/products/new", async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const data = await connection
      .promise()
      .query(
        `INSERT INTO products(name,price,stock,category) VALUES ('${name}', '${price}', '${stock}', '${category}')`
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

app.get("/api/users/:id");
app.put("/api/users/:id");
app.delete("/api/users/:id");

app.post("api/signup", async (req, res) => {
  const { password, username, firstName, lastName, email } = req.body;
  if ((username, password, firstName, lastName, email)) {
    let user = await connection.promise()
      .query(`INSERT INTO users (firstName, lastName, email, username, password, isAdmin)
    VALUES ('${firstName}', '${lastName}', '${email}', '${username}', '${password}', false )`);
    console.log(user);
  } else {
    console.log("error");
  }
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
