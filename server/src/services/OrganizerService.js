const organizerModel = require("../models/OrganizerModel");
// const notificationModel = require("../models/NotificationModel");
// const { sendRealtimeNotification } = require("../socket/socketManager");

exports.getAllOrganizers = async () => {
  const orgs = await organizerModel.findAllOrganizer();

  if (!orgs || orgs.length === 0) {
    const error = new Error("No records found!");
    error.statusCode = 404;
    throw error;
  }

  return orgs;
};

exports.getOrganizerById = async (accountId) => {
  if (!accountId) {
    const error = new Error("Invalid Organizer Account  Id");
    error.statusCode = 404;
    throw error;
  }

  const org = await organizerModel.findOrganizerById(accountId);

  return org;
};

exports.updateOrganizerById = async (accountId, orgData) => {
  return await organizerModel.updateOrganizerById(accountId, orgData);
};

exports.updateOrgStatus = async (accountId, status) => {
  return await organizerModel.updateStatus(accountId, status);
};
