const conn = require("../config/db");
const profileService = require("../services/profile_service");

// ดึงข้อมูล Profile ของตนเองที่เข้าสู่ระบบอยู่
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ดึงข้อมูล Profile ตาม user_id
const getProfileByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const profile = await profileService.getProfileByUserId(user_id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// สร้างหรือแก้ไข Profile ของตนเอง (Upsert Profile)
const updateMyProfile = async (req, res) => {
  const userId = req.user.user_id;
  const {
    first_name,
    last_name,
    phone_number,
    avatar_url,
    address,
    birth_date,
  } = req.body;

  const connection = await conn.getConnection();

  try {
    await connection.beginTransaction();

    const existingProfile = await profileService.findProfileByUserId(
      userId,
      connection,
    );

    if (!existingProfile) {
      // หากยังไม่มี Profile -> สร้างขึ้นใหม่โดยใช้ user_id
      const newProfile = {
        user_id: userId,
        first_name: first_name || null,
        last_name: last_name || null,
        phone_number: phone_number || null,
        avatar_url: avatar_url || null,
        address: address || null,
        birth_date: birth_date || null,
      };

      await profileService.createProfile(newProfile, connection);
    } else {
      // หากมี Profile แล้ว -> อัปเดตข้อมูล
      const updateData = {
        first_name,
        last_name,
        phone_number,
        avatar_url,
        address,
        birth_date,
      };

      await profileService.updateProfile(userId, updateData, connection);
    }

    await connection.commit();

    // ดึงข้อมูลล่าสุดกลับไปแสดงผล
    const updatedProfile = await profileService.getProfileByUserId(userId);

    return res.status(200).json({
      success: true,
      message: existingProfile
        ? "Profile updated successfully"
        : "Profile created successfully",
      data: updatedProfile,
    });
  } catch (err) {
    await connection.rollback();
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getMyProfile,
  getProfileByUserId,
  updateMyProfile,
};
