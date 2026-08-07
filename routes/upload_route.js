const express = require("express");
const router = express.Router();
const upload = require("../utils/upload_middleware");
const uploadController = require("../controllers/upload_controller");

// POST /api/upload - อัปโหลดรูปภาพ 1 รูป (field name: "image")
router.post(
  "/",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  },
  uploadController.uploadImage,
);

module.exports = router;
