import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrder,
  getOrdersByUser,
  getOrdersByEvent,
  getOrderById,
  placeOrder,
  updateTicketOrder,
  updateOrderCompleted,
  updateOrderCanceled,
} from "../services/orderService";

// export const useOrders = () => {
//   return useQuery({
//     queryKey: ["orders"],
//     queryFn: getAllOrder,
//   });
// };

export const useOrders = (maCTySuKien) => {
  const { data, ...rest } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  let filteredOrders = maCTySuKien
    ? data?.filter((order) => order.maCTySuKien === maCTySuKien) || []
    : data;

  return { data: filteredOrders, ...rest };
};

export const useOrderByUser = (id) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrdersByUser(id),
    enabled: !!id,
  });
};

export const useOrderByEvent = (id) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrdersByEvent(id),
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

export const useUpdateOrderCanceled = () => {
  return useMutation({
    mutationFn: ({ orderId }) => updateOrderCanceled(orderId),
  });
};
