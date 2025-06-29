const notificationModel = require("../models/NotificationModel");

exports.getNotificationByUser = async (accountId) => {
  const notify = await notificationModel.findNotificationByUser(accountId);
  return notify;
};

exports.markAsRead = async (accountId) => {
  return await notificationModel.updateAsRead(accountId);
};
