const express = require("express");
const {
  getNotificationByUser,
  markAsRead,
} = require("../controllers/NotificationController");

const router = express.Router();

router.get("/get-notify-by-user/:id", getNotificationByUser);
router.post("/mark-as-read/:id", markAsRead);

module.exports = router;
