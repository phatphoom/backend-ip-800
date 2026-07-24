const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product_controller");

router.get("/all/", ProductController.getProducts);

router.get("/:id", ProductController.getProduct);

router.post("/add", ProductController.createProduct);

router.put("/edit/:id", ProductController.updateProduct);

router.delete("/delete/:id", ProductController.deleteProduct);

module.exports = router;
