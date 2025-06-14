import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrdersByUser,
  getOrderById,
  placeOrder,
  updateTicketOrder,
  updateOrderCompleted,
} from "../services/orderService";

export const useOrderByUser = (id) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrdersByUser(id),
    enabled: !!id,
  });
};

export const useOrderById = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (error) => {
      console.error("Lỗi đặt vé:", error);
    },
  });
};

export const useUpdateTicketOrder = () => {
  return useMutation({
    mutationFn: ({ orderId, ticketData }) =>
      updateTicketOrder(orderId, ticketData),
  });
};

export const useUpdateOrderCompleted = () => {
  return useMutation({
    mutationFn: ({ orderId, orderData }) =>
      updateOrderCompleted(orderId, orderData),
  });
};
