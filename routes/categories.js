const express = require("express");
const conn = require("../config/db");
const router = express.Router();

// Get all categories with product count
router.get(["/category", "/categories"], async (req, res) => {
  try {
    const [result] = await conn.query(`
      SELECT 
        c.cate_id,
        c.cate_name,
        COUNT(p.prod_id) AS product_count
      FROM categories c
      LEFT JOIN products p ON c.cate_id = p.cate_id
      GROUP BY c.cate_id, c.cate_name
      ORDER BY c.cate_id ASC
    `);

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
