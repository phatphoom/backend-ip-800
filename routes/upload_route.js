const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/auth_middleware");
const validateBase64Image = require("../utils/upload_middleware");
const uploadController = require("../controllers/upload_controller");

// POST /api/upload - อัปโหลดรูปภาพ 1 รูป (Base64) - ต้องเข้าสู่ระบบ (User/Admin)
router.post("/", verifyToken, validateBase64Image, uploadController.uploadImage);

module.exports = router;

