const redisClient = require("./redisClient");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Lưu OTP vào Redis với thời gian hiệu lực (2 phút)
// const setOTP = async (email) => {
//   const otp = generateOTP();
//   await redisClient.setEx(`otp:${email}`, 60, otp);
//   return otp;
// };

const setOTP = async (email, type) => {
  const otp = generateOTP();
  await redisClient.setEx(`otp:${type}:${email}`, 60, otp);
  return otp;
};

//Lấy OTP từ Redis
// const getOTP = async (email) => {
//   return await redisClient.get(`otp:${email}`);
// };

const getOTP = async (email, type) => {
  return await redisClient.get(`otp:${type}:${email}`);
};

//Xóa OTP sau khi xác thực
// const clearOTP = async (email) => {
//   await redisClient.del(`otp:${email}`);
// };

const clearOTP = async (email, type) => {
  await redisClient.del(`otp:${type}:${email}`);
};

module.exports = { setOTP, getOTP, clearOTP };
