//express
const express = require("express");
const app = express();
//env
require("dotenv").config();
//cors
const cors = require("cors");
//database module
const { connection, dbQuery } = require("./database");
//extra packages
const uid = require("uid").uid;
const bcrypt = require("bcrypt");

//testing cookies
const jwt = require("jsonwebtoken");
//middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
connection.query(`USE ${process.env.DB_DBID}`);

const verifyAdmin = (req, res, next) => {
  let token = req.headers["x-access-token"];
  let user = jwt.verify(`${token}i`, process.env.SECRET, (err, decode) => {
    if (err) {
      return false;
    }
    return decode.isAdmin;
  });
  if (user) {
    next();
  } else {
    return res.status(403).json({
      request: false,
      message: "You are not an admin",
    });
  }
};
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
    const data = await dbQuery(
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

//creating user !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/api/signup", async (req, res) => {
  //destructuring user details
  const { username, password, firstName, surname, email } = req.body;
  //if all details are available create a new user
  if ((username, password, firstName, surname, email)) {
    //checking if username is already being used
    let usernameCheck = await dbQuery(
      `SELECT * FROM users WHERE username = '${username}'`
    );
    //checking if email is already being used
    let emailCheck = await dbQuery(
      `SELECT * FROM users WHERE email = '${email}'`
    );
    //if the length is  0 = username is available else username is not available
    if (!usernameCheck[0].length && !emailCheck[0].length) {
      //hashing password so we can store it in the db
      let hash = await bcrypt.hash(password, 15);
      //querying into the db and creating user
      await dbQuery(`INSERT INTO users (id,firstName, surname, email, username, password, isAdmin)
      VALUES ('${uid()}','${firstName}', '${surname}', '${email}', '${username}', '${hash}', false )`);
      let userCreated = await dbQuery(
        `SELECT * FROM users WHERE username = '${username}'`
      );
      res.status(201).json({
        request: "success",
        id: userCreated[0][0].id,
        isAdmin: userCreated[0][0].isAdmin,
        username: userCreated[0][0].username,
      });
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

//loging user in !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    //querying into the db to find user
    const checkUser = await dbQuery(
      `SELECT * FROM users WHERE username = '${username}'`
    );
    //if user was found check that the passwords match
    if (checkUser[0][0]) {
      let pass = checkUser[0][0].password;
      let result = await bcrypt.compare(password, pass);
      //if passwords match, log in user
      if (result) {
        //send jwt token
        let token = jwt.sign(
          { isAdmin: checkUser[0][0].isAdmin, id: checkUser[0][0].id },
          process.env.SECRET,
          {
            algorithm: "HS256",
          }
        );
        return res.json({
          request: "success",
          userId: checkUser[0][0].id,
          token,
        });
      } else {
        return res.status(406).json({
          request: "failed",
          message: "Username or password incorrect",
        });
      }
    } else {
      return res.status(406).json({
        request: "failed",
        message: "Username or password incorrect",
      });
    }
  } catch (e) {
    console.log(e);
  }
}); // logging user in !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//admin panel
app.get("/api/users", verifyAdmin, async (req, res) => {
  let results = await dbQuery("SELECT * FROM users");
  for (let i = 0; i < results[0].length; i++) {
    delete results[0][i].password;
  }
  return res.status(200).json({
    request: true,
    data: results[0],
  });
}); // admin panel

app.listen(5000, () => {
  console.log("listening on port 5000");
});
