const categoryService = require("../services/category_service");

/**
 * GET /api/categories หรือ /api/category
 * ดึงรายการหมวดหมู่ทั้งหมด
 */
const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategoriesWithCount();
    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * GET /api/categories/:id
 * ดึงข้อมูลหมวดหมู่ตาม cate_id
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * POST /api/categories
 * เพิ่มหมวดหมู่สินค้าใหม่ (Admin only)
 */
const createCategory = async (req, res) => {
  try {
    const { cate_name, image_url } = req.body;

    if (!cate_name || cate_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "cate_name is required",
      });
    }

    const newCategory = await categoryService.createCategory({
      cate_name: cate_name.trim(),
      image_url: image_url || null,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * PUT /api/categories/:id
 * แก้ไขหมวดหมู่สินค้า (Admin only)
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category id is required",
      });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided for update",
      });
    }

    const existingCategory = await categoryService.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await categoryService.updateCategory(updateData, id);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: { id, ...updateData },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * DELETE /api/categories/:id
 * ลบหมวดหมู่สินค้า (Admin only)
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category id is required",
      });
    }

    const existingCategory = await categoryService.getCategoryById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await categoryService.deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
