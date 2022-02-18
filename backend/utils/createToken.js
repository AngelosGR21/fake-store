const jwt = require("jsonwebtoken");

const createToken = (user) => {
    const token = jwt.sign({
        isAdmin: user[0][0].isAdmin,
        id: user[0][0].id,
        username: user[0][0].username,
        firstName: user[0][0].firstName,
        surname: user[0][0].surname,
        email: user[0][0].email,
      },
      process.env.SECRET,
      { algorithm: "HS256", expiresIn: "2days" })
    
    return token;
}

module.exports = createToken;