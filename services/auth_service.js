const conn = require("../config/db");

const findUserByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await conn.execute(sql, [email]);
  return rows[0];
};

const findUserById = async (userId) => {
  const sql = `SELECT user_id, username, email, role, created_at FROM users WHERE user_id = ?`;
  const [rows] = await conn.execute(sql, [userId]);
  return rows[0];
};

const findUserWithPasswordById = async (userId) => {
  const sql = `SELECT * FROM users WHERE user_id = ?`;
  const [rows] = await conn.execute(sql, [userId]);
  return rows[0];
};

const createUser = async (user, connection = null) => {
  const sql = `
    INSERT INTO users (user_id, username, email, password, role) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    user.user_id,
    user.username,
    user.email,
    user.password,
    user.role || "user",
  ];

  const db = connection || conn;
  const [result] = await db.execute(sql, params);
  return result;
};

const updatePassword = async (userId, hashedPassword, connection = null) => {
  const sql = `UPDATE users SET password = ? WHERE user_id = ?`;
  const db = connection || conn;
  const [result] = await db.execute(sql, [hashedPassword, userId]);
  return result;
};

const updatePasswordByEmail = async (email, hashedPassword, connection = null) => {
  const sql = `UPDATE users SET password = ? WHERE email = ?`;
  const db = connection || conn;
  const [result] = await db.execute(sql, [hashedPassword, email]);
  return result;
};

const deleteUser = async (userId, connection = null) => {
  const db = connection || conn;
  // ลบ profile ก่อน (ถ้าไม่ได้ตั้ง ON DELETE CASCADE ในฐานข้อมูล)
  await db.execute(`DELETE FROM user_profiles WHERE user_id = ?`, [userId]);
  // ลบ user
  const [result] = await db.execute(`DELETE FROM users WHERE user_id = ?`, [userId]);
  return result;
};

module.exports = {
  findUserByEmail,
  findUserById,
  findUserWithPasswordById,
  createUser,
  updatePassword,
  updatePasswordByEmail,
  deleteUser,
};
