import axiosInstance from "../utils/axios";

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/user/get-all");
  return res.data?.data || [];
};

export const getUserById = async (id) => {
  const res = await axiosInstance.get(`/user/get-details/${id}`);
  return res.data.data[0] || [];
};

export const updateUser = async (id, formData) => {
  const res = await axiosInstance.patch(`/user/update-user/${id}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
