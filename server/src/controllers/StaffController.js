const staffService = require("../services/StaffService");

exports.getStaffById = async (req, res) => {
  try {
    const accountId = req.params.id;
    const staff = await staffService.getStaffById(accountId);
    console.log(staff);

    if (!staff || staff.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Không tìm thấy dữ liệu nhân viên",
      });
    }

    res.status(200).send({
      success: true,
      message: "Staff Record",
      data: staff,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

exports.updateStaffById = async (req, res) => {
  try {
    const accountId = req.params.id;
    const file = req.file;
    const staffData = {
      ...req.body,
      anhDaiDien: file?.path || null,
    };

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "Mã tài khoản không hợp lệ",
      });
    }

    const staff = await staffService.updateStaffById(accountId, staffData);

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: staff,
    });
  } catch (error) {
    console.error("error", error);

    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: {
        details: error.message || null,
      },
    });
  }
};
