import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStaffById, updateStaff } from "../services/staffService";

export const useStaffById = (id) => {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => getStaffById(id),
    enabled: !!id,
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};
