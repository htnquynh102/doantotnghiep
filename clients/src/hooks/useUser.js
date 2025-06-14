import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, getUserById, updateUser } from "../services/userService";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};

export const useUserById = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};
