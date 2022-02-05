const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  userDetails,
} = require("../controllers/authentication");

//middleware
const { verifyUser } = require("../middleware");

router.get("/userInfo", verifyUser, userDetails);
router.post("/signup", createUser);
router.post("/login", loginUser);

module.exports = router;
