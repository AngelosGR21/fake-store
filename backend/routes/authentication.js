const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  userDetails,
} = require("../controllers/authentication");

router.get("/userInfo", userDetails);
router.post("/signup", createUser);
router.post("/login", loginUser);

module.exports = router;
