const { dbQuery } = require("../database");

const getUsers = async (req, res) => {
  let results = await dbQuery(
    "SELECT id , email, firstName, surname, username, isAdmin FROM users;"
  );
  return res.status(200).json({
    request: true,
    data: results[0],
  });
};

module.exports = { getUsers };
