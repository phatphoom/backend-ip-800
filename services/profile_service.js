const conn = require("../config/db");

// ดึงข้อมูล Profile ตาม user_id (พร้อมข้อมูล username, email จากตาราง users)
const getProfileByUserId = async (userId) => {
  const sql = `
    SELECT 
      p.profile_id,
      p.user_id,
      u.username,
      u.email,
      u.role,
      p.first_name,
      p.last_name,
      p.avatar_url,
      p.created_at,
      p.updated_at
    FROM users u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    WHERE u.user_id = ?
  `;
  const [rows] = await conn.execute(sql, [userId]);
  return rows[0];
};

// ตรวจสอบว่า user มี profile หรือยัง
const findProfileByUserId = async (userId, connection = null) => {
  const sql = `SELECT * FROM user_profiles WHERE user_id = ?`;
  const db = connection || conn;
  const [rows] = await db.execute(sql, [userId]);
  return rows[0];
};

// สร้าง Profile ใหม่
const createProfile = async (profileData, connection = null) => {
  const sql = `
    INSERT INTO user_profiles (profile_id, user_id, first_name, last_name, avatar_url)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    profileData.profile_id,
    profileData.user_id,
    profileData.first_name || null,
    profileData.last_name || null,
    profileData.avatar_url || null,
  ];

  const db = connection || conn;
  const [result] = await db.execute(sql, params);
  return result;
};

// แก้ไข Profile
const updateProfile = async (userId, profileData, connection = null) => {
  const sql = `
    UPDATE user_profiles 
    SET 
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      avatar_url = COALESCE(?, avatar_url),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;
  const params = [
    profileData.first_name !== undefined ? profileData.first_name : null,
    profileData.last_name !== undefined ? profileData.last_name : null,
    profileData.avatar_url !== undefined ? profileData.avatar_url : null,
    userId,
  ];

  const db = connection || conn;
  const [result] = await db.execute(sql, params);
  return result;
};

module.exports = {
  getProfileByUserId,
  findProfileByUserId,
  createProfile,
  updateProfile,
};
