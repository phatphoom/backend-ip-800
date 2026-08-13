const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product_controller");
const { verifyToken, authorizeRoles } = require("../utils/auth_middleware");

router.get("/all/", ProductController.getProducts);

router.get("/:id", ProductController.getProduct);

router.post("/add", verifyToken, authorizeRoles("admin"), ProductController.createProduct);

router.put("/edit/:id", verifyToken, authorizeRoles("admin"), ProductController.updateProduct);

router.delete("/delete/:id", verifyToken, authorizeRoles("admin"), ProductController.deleteProduct);

module.exports = router;

