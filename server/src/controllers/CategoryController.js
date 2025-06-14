const categoryService = require("../services/CategoryService");
const AppError = require("../utils/AppError");

const getAllCategories = async (req, res) => {
  try {
    const cats = await categoryService.getAllCategories();
    res.status(200).json({
      success: true,
      message: "All category records",
      totalEvent: cats.length,
      data: cats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const catId = req.params.id;
    const cat = await categoryService.getCategoryById(catId);

    if (!cat || cat.length === 0) {
      return next(new AppError("No record found"));
    }

    res.status(200).send({
      success: true,
      message: "Category Record",
      data: cat,
    });
  } catch (error) {
    return next(new AppError("Error in fetch category by id"));
  }
};

const createCategory = async (req, res) => {
  try {
    const cat = await categoryService.createCategory(req.body);

    res.status(200).send({
      success: true,
      message: "New category record",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in create category api",
      error: {
        details: error.message || null,
      },
    });
  }
};

const updateCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return next(new AppError("Invalid Event Id!", 404));
    }

    const cat = await categoryService.updateCategoryById(categoryId, req.body);

    res.status(200).send({
      success: true,
      message: "Category updated",
      data: cat,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error in update category api",
      error: {
        details: error.message || null,
      },
    });
  }
};

const updateCategoryStatus = async (req, res) => {
  const { id, status } = req.params;

  try {
    await categoryService.updateCategoryStatus(id, status);
    res.status(200).send({
      success: true,
      message: "Category Status updated",
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    return res.status(500).send({
      success: false,
      message: "Error in update category status api",
      error: {
        details: error.message || null,
      },
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  updateCategoryStatus,
};
