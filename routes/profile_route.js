const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile_controller");
const { verifyToken } = require("../utils/auth_middleware");

// GET /api/profile/me - ดึงข้อมูลโปรไฟล์ของตนเองที่ Login อยู่
router.get("/me", verifyToken, profileController.getMyProfile);

// PUT /api/profile/me - อัปเดต/สร้างโปรไฟล์ของตนเอง
router.put("/me", verifyToken, profileController.updateMyProfile);

// POST /api/profile/me - รองรับ POST สำหรับอัปเดต/สร้างโปรไฟล์ของตนเอง
router.post("/me", verifyToken, profileController.updateMyProfile);

// GET /api/profile/:user_id - ดึงข้อมูลโปรไฟล์ตาม user_id
router.get("/:user_id", verifyToken, profileController.getProfileByUserId);

module.exports = router;
