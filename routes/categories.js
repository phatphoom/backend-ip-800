const express = require("express");
const conn = require("../config/db");
const router = express.Router();

router.get("/category", async (req, res) => {
  try {
    const [result] = await conn.query(
      `SELECT cate_id,cate_name from categories`,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
