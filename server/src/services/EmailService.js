const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    console.log(`Đang gửi OTP đến: ${email}, Mã OTP: ${otp}`);
    await transporter.sendMail({
      from: `"Hệ thống" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã OTP xác thực tài khoản",
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 2 phút.`,
    });
    console.log(`OTP đã được gửi đến ${email}`);
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

module.exports = { sendOTP };
