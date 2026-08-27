const bcrypt = require("bcryptjs");
const conn = require("../config/db");
const profileService = require("./profile_service");
const { generateSequentialId } = require("../utils/generateId");

const findUserByEmail = async (email, connection = null) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const db = connection || conn;
  const [rows] = await db.execute(sql, [email]);
  return rows[0] || null;
};

const findUserById = async (userId, connection = null) => {
  const sql = `SELECT user_id, username, email, role, created_at FROM users WHERE user_id = ?`;
  const db = connection || conn;
  const [rows] = await db.execute(sql, [userId]);
  return rows[0] || null;
};

const findUserWithPasswordById = async (userId, connection = null) => {
  const sql = `SELECT * FROM users WHERE user_id = ?`;
  const db = connection || conn;
  const [rows] = await db.execute(sql, [userId]);
  return rows[0] || null;
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

/**
 * สมัครสมาชิกผู้ใช้ใหม่ พร้อมสร้าง User Profile อัตโนมัติใน Transaction เดียวกัน
 */
const registerUser = async ({ username, email, password }) => {
  const connection = await conn.getConnection();

  try {
    await connection.beginTransaction();

    const existingUser = await findUserByEmail(email, connection);
    if (existingUser) {
      const error = new Error("Email is already registered");
      error.statusCode = 400;
      error.errors = { email: "Email is already in use" };
      throw error;
    }

    const userId = await generateSequentialId(
      connection,
      "user",
      "user_id",
      "users",
      4,
    );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      user_id: userId,
      username,
      email,
      password: hashedPassword,
      role: "user",
    };

    await createUser(newUser, connection);

    // Auto-create blank user_profile for 1:1 relationship
    await profileService.createProfile(
      {
        user_id: userId,
      },
      connection,
    );

    await connection.commit();

    return {
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
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

/**
 * ลบบัญชีผู้ใช้ พร้อมตรวจสอบรหัสผ่าน (ถ้ามี) ใน Transaction
 */
const deleteUserAccount = async (userId, password = null) => {
  const connection = await conn.getConnection();

  try {
    await connection.beginTransaction();

    const user = await findUserWithPasswordById(userId, connection);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const error = new Error("Incorrect password for account deletion");
        error.statusCode = 400;
        error.errors = { password: "Password is incorrect" };
        throw error;
      }
    }

    await deleteUser(userId, connection);
    await connection.commit();

    return true;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  findUserWithPasswordById,
  createUser,
  registerUser,
  updatePassword,
  updatePasswordByEmail,
  deleteUser,
  deleteUserAccount,
};
