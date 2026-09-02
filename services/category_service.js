const conn = require("../config/db");
const { generateSequentialId } = require("../utils/generateId");
const { getFormattedDateTime } = require("../utils/formatDate");

/**
 * ดึงรายการหมวดหมู่สินค้าทั้งหมด พร้อมจำนวนสินค้าในแต่ละหมวดหมู่
 */
const getCategoriesWithCount = async () => {
  const sql = `
    SELECT 
      c.cate_id,
      c.cate_name,
      c.image_url,
      COUNT(p.prod_id) AS product_count
    FROM categories c
    LEFT JOIN products p ON c.cate_id = p.cate_id AND p.deleted_at IS NULL
    WHERE c.deleted_at IS NULL
    GROUP BY c.cate_id, c.cate_name, c.image_url
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
    SELECT cate_id, cate_name, image_url 
    FROM categories 
    WHERE cate_id = ? AND deleted_at IS NULL
  `;
  const [rows] = await conn.execute(sql, [cateId]);
  return rows[0] || null;
};

/**
 * สร้างหมวดหมู่ใหม่
 */
const createCategory = async (categoryData) => {
  const connection = await conn.getConnection();

  try {
    await connection.beginTransaction();

    const cate_id = await generateSequentialId(
      connection,
      "cate",
      "cate_id",
      "categories",
      3
    );

    const newCategory = {
      cate_id,
      cate_name: categoryData.cate_name,
      image_url: categoryData.image_url || null,
    };

    const sql = `
      INSERT INTO categories (cate_id, cate_name, image_url)
      VALUES (?, ?, ?)
    `;

    await connection.execute(sql, [
      newCategory.cate_id,
      newCategory.cate_name,
      newCategory.image_url,
    ]);

    await connection.commit();
    return newCategory;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/**
 * แก้ไขข้อมูลหมวดหมู่
 */
const updateCategory = async (fields, id) => {
  const allowedFields = ["cate_name", "image_url"];

  const keysToUpdate = Object.keys(fields).filter((key) =>
    allowedFields.includes(key)
  );

  if (keysToUpdate.length === 0) {
    throw new Error("No valid fields to update");
  }

  const setClause = keysToUpdate.map((key) => `${key} = ?`).join(", ");
  const values = keysToUpdate.map((key) => fields[key]);
  const updatedAt = getFormattedDateTime();

  const sql = `
    UPDATE categories 
    SET ${setClause}, updated_at = ? 
    WHERE cate_id = ? AND deleted_at IS NULL
  `;

  const [updateResult] = await conn.execute(sql, [...values, updatedAt, id]);
  return updateResult;
};

/**
 * ลบหมวดหมู่ (Soft Delete)
 */
const deleteCategory = async (id) => {
  const deletedAt = getFormattedDateTime();
  const sql = `
    UPDATE categories 
    SET deleted_at = ? 
    WHERE cate_id = ? AND deleted_at IS NULL
  `;
  const [result] = await conn.execute(sql, [deletedAt, id]);
  return result;
};

module.exports = {
  getCategoriesWithCount,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
