const categoryModel = require("../models/CategoryModel");
const notificationModel = require("../models/NotificationModel");
const { sendRealtimeNotification } = require("../socket/socketManager");

exports.getAllCategories = async () => {
  const cats = await categoryModel.findAllCategory();

  if (!cats || cats.length === 0) {
    const error = new Error("No records found!");
    error.statusCode = 404;
    throw error;
  }

  return cats;
};

exports.getCategoryById = async (categoryId) => {
  if (!categoryId) {
    const error = new Error("Invalid Category Id");
    error.statusCode = 404;
    throw error;
  }

  const cat = await categoryModel.findCategoryById(categoryId);

  return cat;
};

exports.createCategory = async (categoryData) => {
  const requiredFields = ["tenDanhMuc", "trangThai"];

  const missingFields = requiredFields.filter(
    (field) =>
      !categoryData[field] ||
      (typeof categoryData[field] === "string" &&
        categoryData[field].trim() === "")
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(", ")}`);
  }

  const cat = await categoryModel.insertCategory(categoryData);
  return cat;
};

exports.updateCategoryById = async (categoryId, categoryData) => {
  const requiredFields = ["tenDanhMuc"];

  const missingFields = requiredFields.filter(
    (field) =>
      !categoryData[field] ||
      (typeof categoryData[field] === "string" &&
        categoryData[field].trim() === "")
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing fields: ${missingFields.join(", ")}`);
  }

  const cat = await categoryModel.updateCategoryById(categoryId, categoryData);
  return cat;
};

exports.updateCategoryStatus = async (categoryId, status) => {
  const maTaiKhoan = await categoryModel.getAccountIdByCategory(categoryId);
  const [cat] = await categoryModel.findCategoryById(categoryId);

  await categoryModel.updateStatus(categoryId, status);

  if (maTaiKhoan) {
    let noiDung = "";

    if (status == 1)
      noiDung = `Danh mục đề xuất của bạn đã được chấp nhận: ${cat.tenDanhMuc}`;
    if (status == 2)
      noiDung = `Danh mục đề xuất của bạn đã được bị từ chối: ${cat.tenDanhMuc}`;

    if (noiDung !== "")
      await notificationModel.createNotification(
        maTaiKhoan,
        "Phản hồi đề xuất",
        noiDung
      );

    sendRealtimeNotification(maTaiKhoan, {
      tieuDe: "Phản hồi đề xuất",
      noiDung: noiDung,
    });
  }
};
