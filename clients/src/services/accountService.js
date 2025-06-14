import axiosInstance from "../utils/axios";

export const getAllAccounts = async () => {
  const res = await axiosInstance.get("/account/get-all");
  return res.data?.data || [];
};

export const login = async (email, matKhau) => {
  try {
    const res = await axiosInstance.post("/account/sign-in", {
      email,
      matKhau,
    });
    console.log("API Login Response:", res);
    return res.data;
  } catch (error) {
    return { error: error.response?.data?.error || "Lỗi đăng nhập!" };
  }
};

export const createAccount = async (data) => {
  const res = await axiosInstance.post("/account/sign-up", data);
  return res.data?.data || [];
};

export const verifyOTP = async (email, otp, type) => {
  return await axiosInstance.post(`/account/verify-otp`, { email, otp, type });
};

export const resendOTP = async (email, type) => {
  return await axiosInstance.post(`/account/resend-otp`, { email, type });
};

export const sendOTPToReset = async (email) => {
  return await axiosInstance.post(`/account/send-otp-reset`, { email });
};

export const resetPassword = async (email, newPassword) => {
  return await axiosInstance.post(`/account/reset-password`, {
    email,
    newPassword,
  });
};

export const updateAccountStatus = async (id, status) => {
  return await axiosInstance.patch(`/account/update-status`, { id, status });
};
