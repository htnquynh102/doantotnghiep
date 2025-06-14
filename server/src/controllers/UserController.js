const userService = require("../services/UserService");
const AppError = require("../utils/AppError");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).send({
      success: true,
      message: "All category records",
      totalEvent: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: {
        details: error.message || null,
      },
    });
  }
};

const getUserById = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const user = await userService.getUserById(accountId);

    if (!user || user.length === 0) {
      return next(new AppError("No record found"));
    }

    res.status(200).send({
      success: true,
      message: "User Record",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: {
        details: error.message || null,
      },
    });
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const file = req.file;
    const userData = {
      ...req.body,
      anhDaiDien: file?.path || null,
    };

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "Mã tài khoản không hợp lệ",
      });
    }

    const user = await userService.updateUserById(accountId, userData);

    res.status(200).send({
      success: true,
      message: "Cập nhật thành công",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: {
        details: error.message || null,
      },
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
};
