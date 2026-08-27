const conn = require("../config/db");

/**
 * ดึงรายการหมวดหมู่สินค้าทั้งหมด พร้อมจำนวนสินค้าในแต่ละหมวดหมู่
 */
const getCategoriesWithCount = async () => {
  const sql = `
    SELECT 
      c.cate_id,
      c.cate_name,
      COUNT(p.prod_id) AS product_count
    FROM categories c
    LEFT JOIN products p ON c.cate_id = p.cate_id
    GROUP BY c.cate_id, c.cate_name
    ORDER BY c.cate_id ASC
  `;
  const [rows] = await conn.query(sql);
  return rows;
};

/**
 * ดึงข้อมูลหมวดหมู่สินค้าตาม cate_id
 */
const getCategoryById = async (cateId) => {
  const sql = `
    SELECT cate_id, cate_name 
    FROM categories 
    WHERE cate_id = ?
  `;
  const [rows] = await conn.execute(sql, [cateId]);
  return rows[0] || null;
};

module.exports = {
  getCategoriesWithCount,
  getCategoryById,
};
