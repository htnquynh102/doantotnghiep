import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrganizers,
  getOrganizerById,
  updateOrganizer,
  updateOrgStatus,
} from "../services/organizerService";

export const useOrganizers = () => {
  return useQuery({
    queryKey: ["organizers"],
    queryFn: async () => {
      const res = await getAllOrganizers();
      return res.filter((org) => org.trangThaiDuyet !== null);
    },
  });
};

export const useOrganizerById = (id) => {
  return useQuery({
    queryKey: ["organizer", id],
    queryFn: () => getOrganizerById(id),
    enabled: !!id,
  });
};

export const useUpdateOrganizer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateOrganizer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["organizer"]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};

export const useUpdateOrgStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateOrgStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["organizer", variables.id]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};
