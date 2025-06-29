const express = require("express");
const {
  createPayment,
  handleWebhook,
} = require("../controllers/PaymentController");
const { authMiddleware } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/create", createPayment);
router.post("/webhook", handleWebhook);

module.exports = router;
