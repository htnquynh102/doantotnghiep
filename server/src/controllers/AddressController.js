const db = require("../database");
const AppError = require("../utils/AppError");

// get all events
const getAllProvince = async (req, res, next) => {
  try {
    const [provinces] = await db.query("SELECT * FROM TINHTHANH");
    if (!provinces || provinces.length === 0) {
      return next(new AppError("No record found", 404));
    }
    res.status(200).send({
      success: true,
      message: "All provinces records",
      data: provinces,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Error in get all province api", 500));
  }
};

const getDistrictByProvince = async (req, res, next) => {
  try {
    const provinceId = req.params.id;
    // console.log("🔹 Province ID:", provinceId);
    const [district] = await db.query(
      `SELECT * FROM QUANHUYEN WHERE maTinhThanh = ?`,
      [provinceId]
    );
    if (!district || district.length === 0) {
      return next(new AppError("No record found", 404));
    }
    res.status(200).send({
      success: true,
      message: "All district records",
      data: district,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Error in get all district by province api", 500));
  }
};

const getWardByDistrict = async (req, res, next) => {
  try {
    const districtId = req.params.id;
    // console.log("🔹 District ID:", districtId);
    const [ward] = await db.query(
      `SELECT * FROM PHUONGXA WHERE maQuanHuyen = ?`,
      [districtId]
    );
    if (!ward || ward.length === 0) {
      return next(new AppError("No record found", 404));
    }
    res.status(200).send({
      success: true,
      message: "All ward records",
      data: ward,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError("Error in get all ward by district api", 500));
  }
};

const getWardInfo = async (req, res, next) => {
  const wardId = req.params.id;

  try {
    const result = await db.query(
      `SELECT px.maPhuongXa, px.tenPhuongXa,
              qh.maQuanHuyen, qh.tenQuanHuyen,
              tt.maTinhThanh, tt.tenTinhThanh
       FROM PHUONGXA px
       JOIN QUANHUYEN qh ON px.maQuanHuyen = qh.maQuanHuyen
       JOIN TINHTHANH tt ON qh.maTinhThanh = tt.maTinhThanh
       WHERE px.maPhuongXa = ?`,
      [wardId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy Phường/Xã" });
    }

    res.json(result[0]);
  } catch (error) {
    return next(new AppError("Error in get ward information api", 500));
  }
};

module.exports = {
  getAllProvince,
  getDistrictByProvince,
  getWardByDistrict,
  getWardInfo,
};
