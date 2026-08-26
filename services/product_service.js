const conn = require("../config/db");

const getAllProduct = async (options = {}) => {
  const {
    search = "",
    page = 1,
    limit = 10,
    category = "",
  } = options;

  let whereClauses = [];
  let params = [];

  const trimmedSearch = typeof search === "string" ? search.trim() : "";
  if (trimmedSearch) {
    whereClauses.push(`(
      p.prod_id LIKE ? OR
      p.prod_name LIKE ? OR
      p.description LIKE ? OR
      c.cate_name LIKE ?
    )`);
    const searchPattern = `%${trimmedSearch}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  const trimmedCategory = typeof category === "string" ? category.trim() : "";
  if (trimmedCategory) {
    whereClauses.push(`(p.cate_id = ? OR c.cate_name LIKE ?)`);
    params.push(trimmedCategory, `%${trimmedCategory}%`);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // 1. Get total count
  const countSql = `
    SELECT COUNT(*) AS total
    FROM products p
    INNER JOIN categories c ON p.cate_id = c.cate_id
    ${whereSql}
  `;
  const [countRows] = await conn.execute(countSql, params);
  const total = countRows[0] ? Number(countRows[0].total) : 0;

  // 2. Pagination calculation
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (parsedPage - 1) * parsedLimit;

  // 3. Get paginated items
  const dataSql = `
    SELECT 
      p.prod_id,
      p.prod_name,
      p.description,
      p.price,
      p.currency,
      p.cate_id,
      c.cate_name AS category_name,      
      p.image_url,
      p.rating_rate,
      p.rating_count,
      p.in_stock,
      p.stock_count,
      p.discount_pct
    FROM products p
    INNER JOIN categories c ON p.cate_id = c.cate_id
    ${whereSql}
    ORDER BY p.prod_id ASC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await conn.query(dataSql, [...params, parsedLimit, offset]);

  return {
    items: rows,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit) || 1,
  };
};

const getEachProduct = async (id) => {
  const sql = `
      SELECT 
        p.prod_id,
        p.prod_name,
        p.description,
        p.price,
        p.currency,
        c.cate_name AS category_name,      
        p.image_url,
        p.rating_rate,
        p.rating_count,
        p.in_stock,
        p.stock_count,
        p.discount_pct
    FROM products p
    INNER JOIN categories c ON p.cate_id = c.cate_id
    WHERE p.prod_id = ?
  `;

  const [rows] = await conn.execute(sql, [id]);
  return rows[0];
};

const addProduct = async (product, connection = null) => {
  const sql = `
    INSERT INTO products (
        prod_id, prod_name, description, price, currency, 
        cate_id, image_url, rating_rate, rating_count, 
        in_stock, stock_count, discount_pct
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    product.prod_id,
    product.prod_name,
    product.description,
    product.price,
    product.currency,
    product.cate_id,
    product.image_url,
    product.rating_rate,
    product.rating_count,
    product.in_stock,
    product.stock_count,
    product.discount_pct,
  ];

  // ใช้ connection ที่ส่งมา (อยู่ใน transaction) หรือ pool ถ้าไม่ได้ส่งมา
  const db = connection || conn;
  const [insertResult] = await db.execute(sql, params);

  return insertResult;
};

const updateProduct = async (fields, id) => {
  const allowedFields = [
    "prod_name",
    "description",
    "price",
    "currency",
    "cate_id",
    "image_url",
    "rating_rate",
    "rating_count",
    "in_stock",
    "stock_count",
    "discount_pct",
  ];

  const keysToUpdate = Object.keys(fields).filter((key) =>
    allowedFields.includes(key),
  );

  if (keysToUpdate.length === 0) {
    throw new Error("No valid fields to update");
  }

  const setClause = keysToUpdate.map((key) => `${key} = ?`).join(", ");
  const values = keysToUpdate.map((key) => fields[key]);

  const sql = `
    UPDATE products 
    SET ${setClause} 
    WHERE prod_id = ?  
  `;

  const [updateResult] = await conn.execute(sql, [...values, id]);

  return updateResult;
};

const deleteProduct = async (id) => {
  const sql = `
    DELETE FROM products 
    WHERE prod_id = ?  
  `;
  const [result] = await conn.execute(sql, [id]);
  return result;
};

module.exports = {
  getAllProduct,
  getProducts: getAllProduct,
  getEachProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
