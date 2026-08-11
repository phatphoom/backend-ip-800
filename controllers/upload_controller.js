const path = require("path");
const fs = require("fs");

// โฟลเดอร์จัดเก็บรูปภาพสินค้า
const uploadDir = path.join(__dirname, "../uploads/products");

const uploadImage = async (req, res) => {
  try {
    const { buffer, ext } = req.fileData;

    // สร้างโฟลเดอร์ uploads/products ถ้ายังไม่มี
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ตั้งชื่อไฟล์สุ่ม: timestamp-random.ext (เช่น 17123456789-123456789.png)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFilename = `${uniqueSuffix}.${ext}`;
    const filePath = path.join(uploadDir, newFilename);

    // เขียนไฟล์ลงดิสก์โดยใช้ Node.js Native fs
    await fs.promises.writeFile(filePath, buffer);

    // สร้าง URL สัมพัทธ์สำหรับเข้าถึงไฟล์
    const imageUrl = `/uploads/products/${newFilename}`;

    return res.status(200).json({
      success: true,
      message: "อัปโหลดรูปภาพสำเร็จ (Base64)",
      data: {
        filename: newFilename,
        size_bytes: buffer.length,
        image_url: imageUrl,
      },
    });
  } catch (err) {
    console.error("Upload controller error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  uploadImage,
};
