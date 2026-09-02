const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category_controller");
const { verifyToken, authorizeRoles } = require("../utils/auth_middleware");

// GET /api/categories หรือ /api/category
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin only endpoints
router.post("/", verifyToken, authorizeRoles("admin"), categoryController.createCategory);
router.put("/:id", verifyToken, authorizeRoles("admin"), categoryController.updateCategory);
router.delete("/:id", verifyToken, authorizeRoles("admin"), categoryController.deleteCategory);

module.exports = router;
