const conn = require("../config/db");

// ดึงข้อมูล Profile ตาม user_id (พร้อมข้อมูล username, email จากตาราง users)
const getProfileByUserId = async (userId, connection = null) => {
  const sql = `
    SELECT 
      p.user_id,
      u.username,
      u.email,
      u.role,
      p.first_name,
      p.last_name,
      p.phone_number,
      p.avatar_url,
      p.address,
      p.created_at,
      p.updated_at
    FROM users u
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    WHERE u.user_id = ?
  `;
  const db = connection || conn;
  const [rows] = await db.execute(sql, [userId]);
  return rows[0] || null;
};

// ตรวจสอบว่า user มี profile หรือยัง
const findProfileByUserId = async (userId, connection = null) => {
  const sql = `SELECT * FROM user_profiles WHERE user_id = ?`;
  const db = connection || conn;
  const [rows] = await db.execute(sql, [userId]);
  return rows[0] || null;
};

// สร้าง Profile ใหม่ (ใช้ user_id เป็น PK/FK)
const createProfile = async (profileData, connection = null) => {
  const sql = `
    INSERT INTO user_profiles (
      user_id,
      first_name,
      last_name,
      phone_number,
      avatar_url,
      address
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    profileData.user_id,
    profileData.first_name || null,
    profileData.last_name || null,
    profileData.phone_number || null,
    profileData.avatar_url || null,
    profileData.address || null,
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
      phone_number = COALESCE(?, phone_number),
      avatar_url = COALESCE(?, avatar_url),
      address = COALESCE(?, address),
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;
  const params = [
    profileData.first_name !== undefined ? profileData.first_name : null,
    profileData.last_name !== undefined ? profileData.last_name : null,
    profileData.phone_number !== undefined ? profileData.phone_number : null,
    profileData.avatar_url !== undefined ? profileData.avatar_url : null,
    profileData.address !== undefined ? profileData.address : null,
    userId,
  ];

  const db = connection || conn;
  const [result] = await db.execute(sql, params);
  return result;
};

/**
 * จัดการสร้างหรืออัปเดต Profile (Upsert) ภายใน Database Transaction
 */
const upsertProfile = async (userId, profileData) => {
  const connection = await conn.getConnection();

  try {
    await connection.beginTransaction();

    const existingProfile = await findProfileByUserId(userId, connection);

    if (!existingProfile) {
      const newProfile = {
        user_id: userId,
        first_name: profileData.first_name || null,
        last_name: profileData.last_name || null,
        phone_number: profileData.phone_number || null,
        avatar_url: profileData.avatar_url || null,
        address: profileData.address || null,
      };

      await createProfile(newProfile, connection);
    } else {
      const updateData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone_number: profileData.phone_number,
        avatar_url: profileData.avatar_url,
        address: profileData.address,
      };

      await updateProfile(userId, updateData, connection);
    }

    await connection.commit();

    const updatedProfile = await getProfileByUserId(userId);
    return {
      isCreated: !existingProfile,
      profile: updatedProfile,
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  getProfileByUserId,
  findProfileByUserId,
  createProfile,
  updateProfile,
  upsertProfile,
};
