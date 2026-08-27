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

module.exports = {
  getCategories,
  getCategoryById,
};
