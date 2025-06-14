const staffModel = require("../models/StaffModel");

exports.getStaffById = async (accountId) => {
  if (!accountId) {
    const staff = new Error("Invalid User Account  Id");
    error.statusCode = 404;
    throw error;
  }

  const staff = await staffModel.findStaffById(accountId);

  return staff;
};

exports.updateStaffById = async (accountId, staffData) => {
  return await staffModel.updateStaffById(accountId, staffData);
};
