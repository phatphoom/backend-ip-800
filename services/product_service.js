const conn = require("../config/db");

const getAllProduct = async () => {
  const [rows] = await conn.execute("SELECT * FROM test");
  return rows;
};

const getEachProduct = async (id) => {
  const [rows] = await conn.execute(
    `
    SELECT * FROM test
    WHERE id = ?`,
    [id],
  );
  return rows[0];
};

const addProduct = async (id, name, age) => {
  const sql = `
    INSERT INTO test (id,name,age) 
    VALUES (?,?,?)
    `;

  const [insertResult] = await conn.execute(sql, [id, name, age]);

  return insertResult;
};

const updateProduct = async (name, age, id) => {
  const sql = `
    UPDATE test 
    SET name = ?, age = ?
    WHERE id = ?  
  `;

  const updateResult = await conn.execute(sql, [name, age, id]);

  return updateResult;
};

const deleteProduct = async (id) => {
  const sql = `
    DELETE FROM test 
    WHERE id = ?  
  `;
  return await conn.execute(sql, [id]);
};

module.exports = {
  getAllProduct,
  getEachProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
