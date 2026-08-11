const express = require("express");
const router = express.Router();
const validateBase64Image = require("../utils/upload_middleware");
const uploadController = require("../controllers/upload_controller");

// POST /api/upload - อัปโหลดรูปภาพ 1 รูป (Base64)
router.post("/", validateBase64Image, uploadController.uploadImage);

module.exports = router;
