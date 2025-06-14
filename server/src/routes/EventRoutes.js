const express = require("express");
const {
  getAllEvents,
  getLatestEvents,
  getEventById,
  updateEventStatus,
  createEvent,
  updateEvent,
} = require("../controllers/EventController");
const { authMiddleware } = require("../middleware/AuthMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/get-all", getAllEvents);
router.get("/get-latest", getLatestEvents);
router.get("/get-details/:id", getEventById);
router.patch("/update-status/:id/:status", updateEventStatus);
router.post(
  "/create-event",
  authMiddleware(["VT000003"]),
  upload.fields([
    { name: "anhBia", maxCount: 1 },
    { name: "minhChung", maxCount: 5 },
  ]),
  createEvent
);
router.put(
  "/update-event/:id",
  authMiddleware(["VT000003"]),
  upload.fields([
    { name: "anhBia", maxCount: 1 },
    { name: "minhChung", maxCount: 5 },
  ]),
  updateEvent
);

module.exports = router;
