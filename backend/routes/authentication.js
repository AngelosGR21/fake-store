const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  userDetails,
  updateUser,
} = require("../controllers/authentication");

//middleware
const { verifyUser } = require("../middleware");

router.get("/userInfo", verifyUser, userDetails);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.put("/update/:endpoint", verifyUser, updateUser);

module.exports = router;
