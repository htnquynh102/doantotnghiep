import axiosInstance from "../utils/axios";

export const getAllOrder = async () => {
  const res = await axiosInstance.get(`/order/get-orders`);
  return res.data.data;
};

export const getOrdersByUser = async (id) => {
  const res = await axiosInstance.get(`/order/get-order-by-user/${id}`);
  return res.data.data;
};

export const getOrdersByEvent = async (id) => {
  const res = await axiosInstance.get(`/order/get-order-by-event/${id}`);
  return res.data.data;
};

export const getOrderById = async (id) => {
  const res = await axiosInstance.get(`/order/get-order-by-id/${id}`);
  return res.data.data;
};

export const placeOrder = async (data) => {
  const res = await axiosInstance.post(`/order/place-order`, data);
  return res.data;
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
