const organizerService = require("../services/OrganizerService");
const AppError = require("../utils/AppError");

const getAllOrganizers = async (req, res) => {
  try {
    const orgs = await organizerService.getAllOrganizers();
    res.status(200).send({
      success: true,
      message: "All category records",
      totalEvent: orgs.length,
      data: orgs,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Error in get all organizers api", 500));
  }
};

const getOrganizerById = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const org = await organizerService.getOrganizerById(accountId);

    if (!org || org.length === 0) {
      return next(new AppError("No record found"));
    }

    res.status(200).send({
      success: true,
      message: "Organizer Record",
      data: org,
    });
  } catch (error) {
    return next(new AppError("Error in fetch Organizer by id"));
  }
};

const updateOrganizerById = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const files = req.files;

    const anhDaiDien = files?.anhDaiDien ? files.anhDaiDien[0].path : null;
    const giayPhepKinhDoanh = files?.giayPhepKinhDoanh
      ? files.giayPhepKinhDoanh[0].path
      : null;

    const orgData = {
      ...req.body,
      anhDaiDien,
      giayPhepKinhDoanh,
    };

    if (!accountId) {
      return next(new AppError("Invalid account Id!", 404));
    }

    const org = await organizerService.updateOrganizerById(accountId, orgData);

    res.status(200).send({
      success: true,
      message: "Organizer updated",
      data: org,
    });
  } catch (error) {
    console.error("error", error);

    return res.status(500).send({
      success: false,
      message: "Error in update Organizer api",
      error: {
        details: error.message || null,
      },
    });
  }
};

const updateOrgStatus = async (req, res) => {
  const { id, status } = req.params;

  try {
    await organizerService.updateOrgStatus(id, status);
    res.status(200).send({
      success: true,
      message: "Organizer Status updated",
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    return res.status(500).send({
      success: false,
      message: "Error in update Organizer status api",
      error: {
        details: error.message || null,
      },
    });
  }
};

module.exports = {
  getAllOrganizers,
  getOrganizerById,
  updateOrganizerById,
  updateOrgStatus,
};
