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

router.get("/all/", ProductController.getProducts);

router.get("/:id", ProductController.getProduct);

router.post("/add", verifyToken, authorizeRoles("admin"), ProductController.createProduct);

router.put("/edit/:id", verifyToken, authorizeRoles("admin"), ProductController.updateProduct);

router.delete("/delete/:id", verifyToken, authorizeRoles("admin"), ProductController.deleteProduct);

module.exports = router;


