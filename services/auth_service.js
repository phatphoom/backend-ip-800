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

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
