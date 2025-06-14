import axiosInstance from "../utils/axios";

export const getAllEvents = async () => {
  const res = await axiosInstance.get("/event/get-all");
  return res.data?.data || [];
};

export const getLatestEvent = async () => {
  const res = await axiosInstance.get("/event/get-latest");
  return res.data?.data || [];
};

export const getEventDetailById = async (id) => {
  const res = await axiosInstance.get(`/event/get-details/${id}`);
  return res.data.data;
};

export const updateEventStatus = async (id, status) => {
  const res = await axiosInstance.patch(
    `/event/update-status/${id}/${status}`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const createEvent = async (eventData) => {
  const headers =
    eventData instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

  const response = await axiosInstance.post(`/event/create-event`, eventData, {
    headers,
    withCredentials: true,
  });

  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const headers =
    eventData instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

  const response = await axiosInstance.put(
    `/event/update-event/${eventId}`,
    eventData,
    {
      headers,
      withCredentials: true,
    }
  );

  return response.data;
};
