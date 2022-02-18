const { dbQuery } = require("../database");
const jwt = require("jsonwebtoken");
const uid = require("uid").uid;
const bcrypt = require("bcrypt");
require("dotenv").config();
const ApiError = require("../utils/error");
const createToken = require("../utils/createToken");

const createUser = async (req, res, next) => {
  try {
    //destructuring user details
    const { username, password, firstName, surname, email } = req.body;
    //if all details are available create a new user
    if (username && password && firstName && surname && email) {
      //checking if username is already being used
      let usernameCheck = await dbQuery(`SELECT * FROM users WHERE username = '${username}'`);
      //checking if email is already being used
      let emailCheck = await dbQuery(`SELECT * FROM users WHERE email = '${email}'`);
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
        let token = createToken(userCreated);
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
          return next(new ApiError(406, "Username and email are already in use"));
        }
        //if only username is in use
        if (usernameCheck[0].length) {
          return next(new ApiError(406, "Username is taken"));
        }
        //if only email is in use
        if (emailCheck[0].length) {
          return next(new ApiError(406, "Email is already being used"));
        }
      }
    } else {
      // fields are missing
     return next(new ApiError(406, "some fields are missing"));
    }
  } catch{
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
        const token = createToken(checkUser);
        return res.json({
          request: "success",
          userId: checkUser[0][0].id,
          token,
        });
      } else {
        return next(new ApiError(406, "Username or password incorrect"));
      }
    } else {
      return next(new ApiError(406, "Username or password incorrect"));
    }
  } catch{
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

const updateUser = async (req, res, next) => {
  try {
    let fetchUser = await dbQuery(`SELECT * FROM users WHERE id = "${req.userID}"`);
    let user = fetchUser[0][0];
    const { endpoint } = req.params;
    // ~~~~~~~~~~~~ ENDPOINTS ~~~~~~~~~~~~
    // general = username/firstName.surname
    // email = email
    // password = password
     // ~~~~~~~~~~~~ ENDPOINTS ~~~~~~~~~~~~
    if (endpoint === "general") {
      const { username, firstName, surname } = req.body;
      //checking if username already exists
      let checkUsername = await dbQuery(`SELECT username FROM users WHERE username = '${username}'`);
       //if username doesn't exist update all data
       if(!checkUsername[0].length){
        let updateUserDetails = await dbQuery(`UPDATE users SET username = "${username}", firstName = "${firstName}", surname = "${surname}" WHERE id = "${req.userID}"`);
        let userUpdated = await dbQuery(`SELECT * FROM users WHERE id = "${req.userID}"`);
        let token = createToken(userUpdated);
        if(token){
          return res.json({
            request: true, 
            moreInformation: updateUserDetails,
            token
          })
        }else{
          next("error")
        }
      }
      //if username is same as the already existing, update data except username
      if (checkUsername[0].length && checkUsername[0][0].username === user.username) {
        let updateUserDetails = await dbQuery(`UPDATE users SET firstName = "${firstName}", surname = "${surname}" WHERE id = "${req.userID}"`);
        let userUpdated = await dbQuery(`SELECT * FROM users WHERE id = "${req.userID}"`);
        let token = createToken(userUpdated);
        if(token){
          return res.status(200).json({ 
            request: true, 
            moreInformation: updateUserDetails,
            token
          });
        }else{
          next("error")
        }
      }
      //if username already exists
      if(checkUsername[0][0].username !== user.username){
        return next(new ApiError(406, "Username taken"))
      }
    }else if(endpoint === "email"){
      const {email} = req.body;
      let checkEmail = await dbQuery(`SELECT email from users WHERE email = "${email}"`);
      //if the email provided is same as the one already in use
      if(checkEmail[0].length && checkEmail[0][0].email === user.email){
        return next(new ApiError(406, "This is your current email"));
      }
      //if email already exists
      if(checkEmail[0].length){
        return next(new ApiError(406, "Email is already being used"));
      }else{
        //email provided is available
        let updateEmail = await dbQuery(`UPDATE users SET email = "${email}" WHERE id = "${req.userID}"`)
        return res.status(200).json({
          request: true,
          moreInformation: updateEmail
        })
      }
    }else if(endpoint === "password"){
      const {password, newPassword} = req.body;
      if(password, newPassword){
        //verifying password for user confirmation 
        let match = await bcrypt.compare(password, user.password)
        //if matched then update password
        if(match){
          //hashing new password
          let newHashedPass = await bcrypt.hash(newPassword, 15); 
           //updating password
          let updatePassword = await dbQuery(`UPDATE users SET password = "${newHashedPass}" WHERE id = "${req.userID}"`);
          return res.status(200).json({
            request: true,
            moreInformation: updatePassword
          })
        }else{
          return next("error")
        }
        
      }else{
        return next(new ApiError(400, "Please insert both fields"))
      }
    }else{
      return next(new ApiError(404, `Route with '${endpoint}' endpoint was not found`));
    }
  } catch{
    return next("error");
  }
};

module.exports = { createUser, loginUser, userDetails, updateUser };
