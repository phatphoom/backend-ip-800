const path = require("path");

/**
 * Base64 Upload Middleware (No Multer)
 * ตรวจสอบความถูกต้องของ Base64 String และประเภทรูปภาพ ก่อนส่งต่อไปยัง Controller
 */
const validateBase64Image = (req, res, next) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "กรุณาส่งข้อมูลรูปภาพในรูปแบบ Base64 (field: 'image')",
      });
    }

    let ext = "png";
    let base64Data = image;

    // ตรวจสอบ Data URL Prefix (เช่น data:image/png;base64,...)
    const matches = image.match(/^data:image\/([a-zA-Z0-9+-]+);base64,(.+)$/);
    if (matches) {
      ext = matches[1] === "jpeg" ? "jpg" : matches[1].toLowerCase();
      base64Data = matches[2];
    } else if (filename) {
      const extFromFileName = path.extname(filename).replace(".", "").toLowerCase();
      if (extFromFileName) ext = extFromFileName;
    }

    // ตรวจสอบชนิดไฟล์รูปภาพที่อนุญาต
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: "อนุญาตเฉพาะไฟล์รูปภาพ (jpg, jpeg, png, gif, webp) เท่านั้น",
      });
    }

    // แปลง Base64 String เป็น Buffer
    const buffer = Buffer.from(base64Data, "base64");

    // จำกัดขนาดไฟล์ไม่เกิน 5 MB
    const maxSize = 5 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return res.status(400).json({
        success: false,
        message: "ขนาดไฟล์รูปภาพเกินกำหนด (ไม่เกิน 5MB)",
      });
    }

    // แนบข้อมูลไฟล์ที่ประมวลผลแล้วเข้ากับ req เพื่อให้ Controller นำไปใช้ต่อ
    req.fileData = {
      buffer,
      ext,
      originalFilename: filename || `image.${ext}`,
    };

    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "ข้อมูล Base64 ไม่ถูกต้อง: " + err.message,
    });
  }
};

module.exports = validateBase64Image;
