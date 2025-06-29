const notificationService = require("../services/NotificationService");

const getNotificationByUser = async (req, res) => {
  try {
    const accountId = req.params.id;
    const result = await notificationService.getNotificationByUser(accountId);

    res.status(200).json({
      success: true,
      message: "Lấy danh sách thông báo thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const accountId = req.params.id;
    const result = await notificationService.markAsRead(accountId);

    res.status(200).json({
      success: true,
      message: "Đã đọc tất cả",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

module.exports = {
  getNotificationByUser,
  markAsRead,
};
