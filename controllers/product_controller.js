const conn = require("../config/db");
const productService = require("../services/product_service");
const { generateSequentialId } = require("../utils/generateId");

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProduct();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getEachProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const createProduct = async (req, res) => {
  const connection = await conn.getConnection(); // ดึง connection จาก pool

  try {
    await connection.beginTransaction(); // เริ่ม transaction

    const {
      prod_name,
      description,
      price,
      currency,
      cate_id,
      image_url,
      rating_rate,
      rating_count,
      in_stock,
      stock_count,
      discount_pct,
    } = req.body;

    // SELECT FOR UPDATE — lock ค้างอยู่ใน transaction เดียวกัน
    const prod_id = await generateSequentialId(
      connection,
      "prod",
      "prod_id",
      "products",
      4,
    );

    const newProduct = {
      prod_id,
      prod_name,
      description,
      price,
      currency,
      cate_id,
      image_url,
      rating_rate,
      rating_count,
      in_stock,
      stock_count,
      discount_pct,
    };

    // INSERT — ยังอยู่ใน transaction เดียวกัน (lock ยังค้างอยู่)
    await productService.addProduct(newProduct, connection);

    await connection.commit(); // ปิด transaction — lock ถูกปลดตรงนี้

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { newProduct },
    });
  } catch (err) {
    await connection.rollback(); // ถ้า error ให้ rollback กลับ
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  } finally {
    connection.release(); // คืน connection กลับ pool เสมอ
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    const product = await productService.updateProduct(updateData, id);

    if (product.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { id, ...updateData },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product id is required",
      });
    }

    const result = await productService.deleteProduct(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
