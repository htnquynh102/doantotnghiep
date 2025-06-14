const express = require("express");
const {
  getAllProvince,
  getDistrictByProvince,
  getWardByDistrict,
  getWardInfo,
} = require("../controllers/AddressController");

const router = express.Router();

router.get("/get-all-province", getAllProvince);
router.get("/get-district-by-province/:id", getDistrictByProvince);
router.get("/get-ward-by-district/:id", getWardByDistrict);
router.get("/get-ward-info/:id", getWardInfo);

module.exports = router;
