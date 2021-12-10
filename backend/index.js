const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const { connection, dbQuery } = require("./database");

connection.query(`USE ${process.env.DB_DBID}`);

app.get("/", async (req, res) => {
  try {
    let data = await dbQuery("SELECT * FROM `products`");
    res.json({ products: data[0], request: "success" });
  } catch (e) {
    res.json({ data: "Data failed to fetch", error: e.code });
  }
});

app.post("/signup", async (req, res) => {
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
