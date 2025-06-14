const userModel = require("../models/UserModel");

exports.getAllUsers = async () => {
  const users = await userModel.findAllUser();

  if (!users || users.length === 0) {
    const error = new Error("No records found!");
    error.statusCode = 404;
    throw error;
  }

  return users;
};

exports.getUserById = async (accountId) => {
  if (!accountId) {
    const user = new Error("Invalid User Account  Id");
    error.statusCode = 404;
    throw error;
  }

  const user = await userModel.findUserById(accountId);

  return user;
};

exports.updateUserById = async (accountId, userData) => {
  return await userModel.updateUserById(accountId, userData);
};
