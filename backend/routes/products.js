const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  deleteProduct,
} = require("../controllers/products");

router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.post("/new", createProduct);

module.exports = router;
