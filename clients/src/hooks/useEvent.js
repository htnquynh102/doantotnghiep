import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllEvents,
  getLatestEvent,
  getEventDetailById,
  updateEventStatus,
  createEvent,
  updateEvent,
} from "../services/eventService";

export const useEvents = (accountId, filterApproved = false) => {
  const { data, ...rest } = useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents,
  });

  let filteredEvents = accountId
    ? data?.filter((event) => event.maTaiKhoan === accountId) || []
    : data;

  if (filterApproved) {
    filteredEvents =
      filteredEvents?.filter((event) => event.trangThaiDuyet === 1) || [];
  }

  return { data: filteredEvents, ...rest };
};

export const useLatestEvents = () => {
  return useQuery({
    queryKey: ["latestEvents"],
    queryFn: getLatestEvent,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useEventById = (id) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventDetailById(id),
    enabled: !!id,
  });
};

export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateEventStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["event", variables.id]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: createEvent,
  });
};

export const useUpdateEvent = () => {
  return useMutation({
    mutationFn: ({ id, data }) => updateEvent(id, data),
  });
};
