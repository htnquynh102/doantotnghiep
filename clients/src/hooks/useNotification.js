import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getNotificationByUser,
  marNotificationAsRead,
} from "../services/notificationService";
export const useNotificationByUser = (id) => {
  return useQuery({
    queryKey: ["notifications", id],
    queryFn: () => getNotificationByUser(id),
    enabled: !!id,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => marNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });
};
