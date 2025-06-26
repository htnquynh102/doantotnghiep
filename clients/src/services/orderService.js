import axiosInstance from "../utils/axios";

export const getOrdersByUser = async (id) => {
  const res = await axiosInstance.get(`/order/get-order-by-user/${id}`);
  return res.data.data;
};

export const getOrderById = async (id) => {
  const res = await axiosInstance.get(`/order/get-order-by-id/${id}`);
  return res.data.data;
};

export const placeOrder = async (data) => {
  const response = await axiosInstance.post(`/order/place-order`, data);
  return response.data;
};

export const updateTicketOrder = async (id, data) => {
  return await axiosInstance.put(`/order/update-ticket-order`, { id, data });
};

export const updateOrderCompleted = async (id, data) => {
  return await axiosInstance.put(`/order/update-order-completed`, { id, data });
};

export const updateOrderCanceled = async (id) => {
  return await axiosInstance.patch(`/order/update-order-canceled`, { id });
};
