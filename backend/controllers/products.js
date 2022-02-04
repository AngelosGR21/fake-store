const { dbQuery } = require("../database");

const getProducts = async (req, res) => {
  try {
    let data = await dbQuery("SELECT * FROM `products`");
    res.json({ products: data[0], request: "success" });
  } catch (e) {
    res.status(400);
    res.json({ data: "Data failed to fetch", error: e.code });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const data = await dbQuery(
      `INSERT INTO products(id,name,price,stock,category) VALUES ('${uid()}','${name}', '${price}', '${stock}', '${category}')`
    );
    res.json({ data_submited: data, status: "success" });
  } catch (e) {
    res.status(400);
    res.json({ data: "Something went wrong", error: e.code });
  }
};

const deleteProduct = async (req, res) => {};

module.exports = { getProducts, createProduct, deleteProduct };
