const { dbQuery } = require("../database");
const jwt = require("jsonwebtoken");
const uid = require("uid").uid;
const bcrypt = require("bcrypt");
require("dotenv").config();
const ApiError = require("../utils/error");

const createUser = async (req, res, next) => {
  try {
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
        //creating token
        let token = jwt.sign(
          {
            isAdmin: checkUser[0][0].isAdmin,
            id: checkUser[0][0].id,
            username: checkUser[0][0].username,
            firstName: checkUser[0][0].firstName,
            surname: checkUser[0][0].surname,
            email: checkUser[0][0].email,
          },
          process.env.SECRET,
          { algorithm: "HS256" }
        );
        //success response
        return res.status(201).json({
          request: true,
          id: userCreated[0][0].id,
          isAdmin: userCreated[0][0].isAdmin,
          username: userCreated[0][0].username,
          token,
        });
      } else {
        //if username and email are in use
        if (usernameCheck[0].length && emailCheck[0].length) {
          next(new ApiError(406, "Username and email are already in use"));
          return;
        }
        //if only username is in use
        if (usernameCheck[0].length) {
          next(new ApiError(406, "Username is taken"));
          return;
        }
        //if only email is in use
        if (emailCheck[0].length) {
          next(new ApiError(406, "Email is already being used"));
          return;
        }
      }
    } else {
      // fields are missing
      next(new ApiError(406, "some fields are missing"));
      return;
    }
  } catch (e) {
    next("error");
  }
};

const loginUser = async (req, res, next) => {
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
          {
            isAdmin: checkUser[0][0].isAdmin,
            id: checkUser[0][0].id,
            username: checkUser[0][0].username,
            firstName: checkUser[0][0].firstName,
            surname: checkUser[0][0].surname,
            email: checkUser[0][0].email,
          },
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
        next(new ApiError(406, "Username or password incorrect"));
        next("error");
        return;
      }
    } else {
      next(new ApiError(406, "Username or password incorrect"));
      return;
    }
  } catch (e) {
    next("error");
  }
};

const userDetails = (req, res, next) => {
  let token = req.headers["x-access-token"];
  //if token was found
  if (token !== "null") {
    //verifying token
    let user = jwt.verify(token, process.env.SECRET, (err, decode) => {
      if (err) {
        return false;
      }
      //if the token passed verification return the user details
      return decode;
    });
    //if token passed verification send the details
    if (user) {
      return res.status(200).json({
        request: true,
        userDetails: user,
      });
    } else {
      next(new ApiError(400, "Token is invalid"));
      return;
    }
  }
  //return false as token didn't pass verification
  next(new ApiError(404, "Token was not found"));
  return;
};

module.exports = { createUser, loginUser, userDetails };
