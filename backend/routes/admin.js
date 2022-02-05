const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/admin");
const { isAdmin } = require("../middleware");

router.get("/users", isAdmin, getUsers);

module.exports = router;
