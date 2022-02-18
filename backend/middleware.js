const jwt = require("jsonwebtoken");
const ApiError = require("./utils/error");

const verifyUser = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (token !== "null") {
    //verifying token
    let user = jwt.verify(token, process.env.SECRET, (err, decode) => {
      if (err) {
        return false;
      }
      //if the token passed verification return the user details
      return decode;
    });
    //if token passed verification give access to route
    if (user) {
      req.userID = user.id;
      next();
      return;
    } else {
      return next(new ApiError(400, "Token is invalid"));
    }
  }
  //return false as token didn't pass verification
  return next(new ApiError(404, "Token was not found"));
};

const isAdmin = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (token !== undefined) {
    let user = jwt.verify(token, process.env.SECRET, (err, decode) => {
      if (err) {
        return err;
      }
      return decode;
    });
    //if user is an admin, next
    if (user.isAdmin) {
      return next();
    } else {
      //user not admin, throw error
      next(new ApiError(401, "Unauthorized"));
      return;
    }
  } else {
    next(new ApiError(404, "token not found"));
    return;
  }
};

module.exports = { verifyUser, isAdmin };
