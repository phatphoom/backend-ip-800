/**
 * ฟังก์ชันสร้าง Prefix ID แบบรันนิ่งยาวต่อเนื่อง (ไม่รีเซ็ตตามวัน/เดือน/ปี)
 * ต้องเรียกภายใน transaction ที่เปิดไว้แล้ว เพื่อให้ FOR UPDATE lock ค้างจนกว่า INSERT เสร็จ
 * @param {Object} connection - MySQL Connection (ที่อยู่ใน transaction แล้ว)
 * @param {string} prefix - อักษรนำหน้า เช่น 'prod', 'cate'
 * @param {string} idColumn - ชื่อ column ที่เก็บ id เช่น 'prod_id', 'cate_id'
 * @param {string} tableName - ชื่อตารางใน Database
 * @param {number} padLength - จำนวนหลักของเลขรันนิ่ง (Default: 4 หลัก -> 0001)
 */
async function generateSequentialId(
  connection,
  prefix,
  idColumn,
  tableName,
  padLength = 4,
) {
  const searchPrefix = `${prefix}_`; // เช่น "prod_"

  // ดึง ID ล่าสุดขึ้นมา (ใช้ FOR UPDATE กัน Race Condition — ต้องอยู่ใน transaction)
  const query = `
    SELECT ${idColumn} 
    FROM ${tableName} 
    WHERE ${idColumn} LIKE ? 
    ORDER BY ${idColumn} DESC 
    LIMIT 1 
    FOR UPDATE
  `;

  const [rows] = await connection.query(query, [`${searchPrefix}%`]);

  let nextNumber = 1;

  // ถ้าในตารางมีข้อมูลอยู่แล้ว ตัดคำ prefix ออก แล้วเอาตัวเลขมา +1
  if (rows.length > 0) {
    const lastId = rows[0][idColumn]; // เช่น "prod_0049"
    const lastNumberStr = lastId.replace(searchPrefix, ""); // ได้ "0049"
    nextNumber = parseInt(lastNumberStr, 10) + 1; // แปลงเป็นเลขแล้ว +1 ได้ 50
  }

  // เติมเลข 0 ข้างหน้าให้ครบหลักตาม padLength (เช่น 50 -> "0050")
  const paddedNumber = String(nextNumber).padStart(padLength, "0");

  return `${searchPrefix}${paddedNumber}`;
}

module.exports = { generateSequentialId };
