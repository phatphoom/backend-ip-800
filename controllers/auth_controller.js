const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authService = require("../services/auth_service");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const errors = {};

  if (!username || username.trim() === "") {
    errors.username = "Username is required";
  }
  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  try {
    const createdUser = await authService.registerUser({
      username: username.trim(),
      email: email.trim(),
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  }
  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  try {
    const user = await authService.findUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.findUserById(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.user_id;
  const { current_password, new_password, confirm_password } = req.body;
  const errors = {};

  if (!current_password) {
    errors.current_password = "Current password is required";
  }
  if (!new_password || new_password.length < 6) {
    errors.new_password = "New password must be at least 6 characters";
  }
  if (confirm_password !== undefined && new_password !== confirm_password) {
    errors.confirm_password = "Confirm password does not match new password";
  }
  if (current_password && new_password && current_password === new_password) {
    errors.new_password = "New password cannot be the same as current password";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  try {
    const user = await authService.findUserWithPasswordById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
        errors: {
          current_password: "Incorrect current password",
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await authService.updatePassword(userId, hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, new_password, confirm_password } = req.body;
  const errors = {};

  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  }
  if (!new_password || new_password.length < 6) {
    errors.new_password = "New password must be at least 6 characters";
  }
  if (confirm_password !== undefined && new_password !== confirm_password) {
    errors.confirm_password = "Confirm password does not match new password";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  try {
    const user = await authService.findUserByEmail(email.trim());
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email",
        errors: {
          email: "User not found",
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await authService.updatePasswordByEmail(email.trim(), hashedPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.user.user_id;
  const { password } = req.body || {};

  try {
    await authService.deleteUserAccount(userId, password);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  resetPassword,
  deleteAccount,
};
