const accountService = require("../services/AccountService");
const otpService = require("../utils/otpService");
const accountModel = require("../models/AccountModel");
const emailService = require("../services/EmailService");
const bcrypt = require("bcrypt");

exports.getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await accountService.getAllAccounts();

    res.status(200).json({
      success: true,
      message: "Lấy dữ liệu thành công",
      data: accounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, matKhau } = req.body;
    const result = await accountService.login(email, matKhau);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    const token = accountService.generateToken({
      email: result.account.email,
      role: result.account.maVaiTro,
    });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict", //Lax, None
    });

    res.status(200).json({ status: "success", token, account: result.account });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("access_token", { path: "/", httpOnly: true });
  return res.status(200).json({ message: "Đăng xuất thành công!" });
};

exports.register = async (req, res) => {
  try {
    const account = await accountService.createAccount(req.body);

    res.status(200).send({
      success: true,
      message: "New account record",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp, type } = req.body;

  try {
    const storedOTP = await otpService.getOTP(email, type);

    if (!storedOTP) {
      return res.status(200).json({
        success: false,
        message: "OTP đã hết hạn! Vui lòng yêu cầu lại.",
      });
    }

    if (storedOTP !== otp) {
      return res
        .status(200)
        .json({ success: false, message: "Mã OTP không đúng!" });
    }

    if (type === "register") {
      await accountModel.updateStatusByEmail(email);
      res.status(200).json({
        success: true,
        message: "Xác thực thành công! Tài khoản đã được kích hoạt.",
      });
    }

    if (type === "reset") {
      return res
        .status(200)
        .json({ success: true, message: "Xác thực OTP thành công!" });
    }

    await otpService.clearOTP(email, type);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  const { email, type } = req.body;

  try {
    const account = await accountModel.findAccountByEmail(email);
    if (type === "register" && account.trangThai === 1) {
      return res.status(400).json({ error: "Tài khoản đã kích hoạt!" });
    }

    if (!account) {
      return res.status(400).json({ error: "Tài khoản không tồn tại!" });
    }

    const newOTP = await otpService.setOTP(email, type);
    await emailService.sendOTP(email, newOTP);

    res.status(200).json({ message: "Mã OTP mới đã được gửi!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendOTPToReset = async (req, res) => {
  const { email } = req.body;

  try {
    const account = await accountModel.findAccountByEmail(email);
    if (!account) {
      return res
        .status(200)
        .json({ success: false, message: "Email không tồn tại!" });
    }

    const otp = await otpService.setOTP(email, "reset");
    await emailService.sendOTP(email, otp);

    res.status(200).json({ success: true, message: "Mã OTP đã được gửi!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Có lỗi hệ thống, vui lòng thử lại sau!",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await accountModel.resetPassword(email, hashedPassword);

    return res
      .status(200)
      .json({ message: "Mật khẩu mới đã được cập nhật thành công!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;

  try {
    await accountService.updateStatus(id, status);
    res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    return res.status(500).jon({
      success: false,
      message: "Lỗi server",
      error: {
        details: error.message,
      },
    });
  }
};
