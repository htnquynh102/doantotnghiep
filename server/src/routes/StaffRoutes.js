const express = require("express");
const staffController = require("../controllers/StaffController");
const { authMiddleware } = require("../middleware/AuthMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/get-details/:id", staffController.getStaffById);
router.patch(
  "/update-staff/:id",
  upload.single("anhDaiDien"),
  staffController.updateStaffById
);

module.exports = router;
