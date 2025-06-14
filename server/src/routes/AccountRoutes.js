const express = require("express");
const authMiddleware = require("../middleware/AuthMiddleware");
const accountController = require("../controllers/AccountController");

const router = express.Router();

router.get("/get-all", accountController.getAllAccounts);
router.post("/sign-in", accountController.login);
router.post("/log-out", accountController.logout);
router.post("/sign-up", accountController.register);
router.post("/verify-otp", accountController.verifyOTP);
router.post("/resend-otp", accountController.resendOTP);
router.post("/send-otp-reset", accountController.sendOTPToReset);
router.post("/reset-password", accountController.resetPassword);
router.patch("/update-status", accountController.updateStatus);

module.exports = router;
