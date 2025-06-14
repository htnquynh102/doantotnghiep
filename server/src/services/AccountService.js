const dotenv = require("dotenv");
const accountModel = require("../models/AccountModel");
const otpService = require("../utils/otpService");
const emailService = require("./EmailService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

exports.getAllAccounts = async () => {
  const accounts = await accountModel.findAllAccounts();

  if (!accounts || accounts.length === 0) {
    const error = new Error("No records found!");
    error.statusCode = 404;
    throw error;
  }

  return accounts;
};

exports.generateToken = (acc) => {
  // return jwt.sign(data, SECRET_KEY, { expiresIn: "1h" });
  return jwt.sign(
    { id: acc.id, email: acc.email, role: acc.role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token Backend:", decoded);
    console.log("User Role:", decoded.role);
    return decoded;
  } catch (error) {
    console.error("Token không hợp lệ:", error);
    return null;
  }
};

exports.login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email và mật khẩu không được để trống");
    }

    const account = await accountModel.findAccountByEmail(email);

    if (!account) {
      // throw new Error("Email không tồn tại");
      return { error: "Tài khoản không tồn tại!" };
    }

    const isMatch = await bcrypt.compare(password, account.matKhau);

    if (!isMatch) {
      return { error: "Thông tin đăng nhập không hợp lệ!" };
    }

    return { status: "success", account };
  } catch (error) {
    // throw new Error(error.message);
    return { error: "Lỗi hệ thống, vui lòng thử lại sau!" };
  }
};

exports.createAccount = async (accountData) => {
  const { maVaiTro, email, matKhau, anhDaiDien, trangThai } = accountData;

  const existingEmail = await accountModel.findAccountByEmail(email);
  if (existingEmail) {
    throw new Error("Email đã tồn tại!");
  }

  if (matKhau.length < 8) {
    throw new Error("Độ dài mật khẩu ít nhất 8 ký tự");
  }

  const hashedPassword = await bcrypt.hash(matKhau, 10);
  const newAccountData = { ...accountData, matKhau: hashedPassword };

  const account = await accountModel.insertAccount(newAccountData);

  const otp = await otpService.setOTP(email, "register");
  await emailService.sendOTP(email, otp);

  return account;
};

exports.updateStatus = async (accountId, status) => {
  return await accountModel.updateStatus(accountId, status);
};
