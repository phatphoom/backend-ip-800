const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product_controller");
const authMiddleware = require("../utils/auth_middleware");

const verifyToken = authMiddleware.verifyToken;
const authorizeRoles = authMiddleware.authorizeRoles || function (...allowedRoles) {
  return function (req, res, next) {
    const userRole = req.user && req.user.role ? String(req.user.role).toLowerCase() : "";
    const normalizedAllowed = allowedRoles.map((r) => String(r).toLowerCase());

    if (!req.user || !normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Insufficient permissions",
      });
    }
    next();
  };
};

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


