const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product_controller");
const { verifyToken, authorizeRoles } = require("../utils/auth_middleware");

// Get products with search & pagination (supports ?search=..., ?q=..., ?page=..., ?limit=..., ?category=...)
router.get("/", ProductController.getProducts);

// Get single product by ID
router.get("/:id", ProductController.getProduct);

// Create product (Admin only)
router.post("/", verifyToken, authorizeRoles("admin"), ProductController.createProduct);

// Update product (Admin only)
router.put("/:id", verifyToken, authorizeRoles("admin"), ProductController.updateProduct);

// Delete product (Admin only)
router.delete("/:id", verifyToken, authorizeRoles("admin"), ProductController.deleteProduct);

module.exports = router;
