import axiosInstance from "../utils/axios";

export const getStaffById = async (id) => {
  const res = await axiosInstance.get(`/staff/get-details/${id}`);
  return res.data.data[0] || [];
};

export const updateStaff = async (id, formData) => {
  const res = await axiosInstance.patch(`/staff/update-staff/${id}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
