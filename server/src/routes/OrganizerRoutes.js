const express = require("express");
const {
  getAllOrganizers,
  getOrganizerById,
  updateOrganizerById,
  updateOrgStatus,
} = require("../controllers/OrganizerController");
const { authMiddleware } = require("../middleware/AuthMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get(
  "/get-all",
  getAllOrganizers,
  authMiddleware(["VT000001", "VT000002"])
);
router.get("/get-details/:id", getOrganizerById);
router.patch(
  "/update-org/:id",
  upload.fields([
    { name: "anhDaiDien", maxCount: 1 },
    { name: "giayPhepKinhDoanh", maxCount: 1 },
  ]),
  updateOrganizerById
);

router.patch("/update-status/:id/:status", updateOrgStatus);

module.exports = router;
