import axiosInstance from "../utils/axios";

export const getNotificationByUser = async (id) => {
  const res = await axiosInstance.get(`/notification/get-notify-by-user/${id}`);
  return res.data.data;
};

export const marNotificationAsRead = async (id) => {
  return await axiosInstance.post(`/notification/mark-as-read/${id}`);
};
