// utils/idGenerator.js

/**
 * ฟังก์ชันสร้าง Prefix ID แบบรันนิ่งยาวต่อเนื่อง (ไม่รีเซ็ตตามวัน/เดือน/ปี)
 * @param {Object} conn - MySQL Connection / Pool
 * @param {string} prefix - อักษรนำหน้า เช่น 'USR', 'PRD', 'ITM'
 * @param {string} tableName - ชื่อตารางใน Database
 * @param {number} padLength - จำนวนหลักของเลขรันนิ่ง (Default: 4 หลัก -> 0001)
 */
async function generateSequentialId(conn, prefix, tableName, padLength = 4) {
  const searchPrefix = `${prefix}_`; // เช่น "USR-"

  // 1. ดึง ID ล่าสุดขึ้นมา (ใช้ FOR UPDATE กัน Race Condition)
  const query = `
    SELECT id 
    FROM ${tableName} 
    WHERE id LIKE ? 
    ORDER BY id DESC 
    LIMIT 1 
    FOR UPDATE
  `;

  const [rows] = await conn.query(query, [`${searchPrefix}%`]);

  let nextNumber = 1;

  // 2. ถ้าในตารางมีข้อมูลอยู่แล้ว ตัดคำ prefix ออก แล้วเอาตัวเลขมา +1
  if (rows.length > 0) {
    const lastId = rows[0].id; // เช่น "USR-0049"

    // ตัดเอาเฉพาะส่วนตัวเลขหลัง "USR-"
    const lastNumberStr = lastId.replace(searchPrefix, ""); // ได้ "0049"
    nextNumber = parseInt(lastNumberStr, 10) + 1; // แปลงเป็นเลขแล้ว +1 ได้ 50
  }

  // 3. เติมเลข 0 ข้างหน้าให้ครบหลักตาม padLength (เช่น 50 -> "0050")
  const paddedNumber = String(nextNumber).padStart(padLength, "0");

  return `${searchPrefix}${paddedNumber}`;
}

module.exports = { generateSequentialId };
