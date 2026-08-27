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

  try {
    const result = await profileService.upsertProfile(userId, {
      first_name,
      last_name,
      phone_number,
      avatar_url,
      address,
      birth_date,
    });

    return res.status(200).json({
      success: true,
      message: result.isCreated
        ? "Profile created successfully"
        : "Profile updated successfully",
      data: result.profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getMyProfile,
  getProfileByUserId,
  updateMyProfile,
};
