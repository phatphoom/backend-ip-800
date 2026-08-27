const express = require("express");
const router = express.Router();

const productRoute = require("./product_route");
const authRoute = require("./auth");
const uploadRoute = require("./upload_route");
const profileRoute = require("./profile_route");
const categoryRoute = require("./categories");
const healthRoute = require("./health");
const welcomeRoute = require("./welcome");

// API Endpoints
router.use("/api/products", productRoute);
router.use("/api/auth", authRoute);
router.use("/api/upload", uploadRoute);
router.use("/api/profile", profileRoute);

// Support both /api/categories and /api/category for backwards compatibility
router.use("/api/categories", categoryRoute);
router.use("/api/category", categoryRoute);

// System & Health Endpoints
router.use("/health", healthRoute);
router.use("/", welcomeRoute);

module.exports = router;
