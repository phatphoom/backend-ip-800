const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const { verifyToken } = require("../utils/auth_middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyToken, authController.getProfile);

module.exports = router;
