const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category_controller");

// GET /api/categories หรือ /api/category
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
