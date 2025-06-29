const staffModel = require("../models/StaffModel");

exports.getStaffById = async (accountId) => {
  const staff = await staffModel.findStaffById(accountId);
  return staff;
};

exports.updateStaffById = async (accountId, staffData) => {
  return await staffModel.updateStaffById(accountId, staffData);
};
