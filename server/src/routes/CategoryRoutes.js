const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  updateCategoryStatus,
} = require("../controllers/CategoryController");

//router object
const router = express.Router();

router.get("/get-all", getAllCategories);
router.get("/get-details/:id", getCategoryById);
router.post("/create-category", createCategory);
router.put("/update-category/:id", updateCategoryById);
router.patch("/update-status/:id/:status", updateCategoryStatus);

module.exports = router;
