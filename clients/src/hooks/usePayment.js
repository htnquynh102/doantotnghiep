import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "../services/paymentService";

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: createPayment,
  });
};
