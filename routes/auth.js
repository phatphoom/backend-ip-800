const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const { verifyToken } = require("../utils/auth_middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyToken, authController.getProfile);

// Password Management
router.put("/change-password", verifyToken, authController.changePassword);
router.post("/reset-password", authController.resetPassword);

// Account Deletion
router.delete("/account", verifyToken, authController.deleteAccount);
router.delete("/me", verifyToken, authController.deleteAccount);

module.exports = router;
