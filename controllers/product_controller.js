const productService = require("../services/product_service");

const getProducts = async (req, res) => {
  try {
    const {
      search,
      q,
      page = 1,
      limit = 10,
      category,
      cate_id,
    } = req.query;

    const searchTerm = search !== undefined ? search : (q !== undefined ? q : "");
    const categoryFilter = category !== undefined ? category : (cate_id !== undefined ? cate_id : "");

    const result = await productService.getAllProduct({
      search: searchTerm,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      category: categoryFilter,
    });

    return res.status(200).json({
      success: true,
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      data: result.items,
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

  // Validation
  if (!prod_name || prod_name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "prod_name is required",
    });
  }

  if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
    return res.status(400).json({
      success: false,
      message: "price must be a non-negative number",
    });
  }

  if (!cate_id) {
    return res.status(400).json({
      success: false,
      message: "cate_id is required",
    });
  }

  try {
    const newProduct = await productService.createProduct({
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
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { newProduct },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
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

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    if (updateData.price !== undefined && (isNaN(updateData.price) || Number(updateData.price) < 0)) {
      return res.status(400).json({
        success: false,
        message: "price must be a non-negative number",
      });
    }

    // ตรวจสอบว่ามีสินค้านี้อยู่จริงหรือไม่
    const existingProduct = await productService.getEachProduct(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productService.updateProduct(updateData, id);

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

    const existingProduct = await productService.getEachProduct(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productService.deleteProduct(id);

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
