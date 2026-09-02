/**
 * ฟังก์ชันแปลง Date เป็นรูปแบบ YYYY-MM-DD HH:mm:ss สำหรับ Soft Delete
 * @param {Date} [date=new Date()]
 * @returns {string} รูปแบบ "2026-09-03 01:27:03"
 */
const getFormattedDateTime = (date = new Date()) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

module.exports = { getFormattedDateTime };
