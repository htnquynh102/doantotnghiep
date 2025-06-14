import axiosInstance from "../utils/axios";

export const getAllOrganizers = async () => {
  const res = await axiosInstance.get("/organizer/get-all");
  return res.data?.data || [];
};

export const getOrganizerById = async (id) => {
  const res = await axiosInstance.get(`/organizer/get-details/${id}`);
  return res.data.data[0] || [];
};

export const updateOrganizer = async (id, formData) => {
  const res = await axiosInstance.patch(
    `/organizer/update-org/${id}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const updateOrgStatus = async (id, status) => {
  const res = await axiosInstance.patch(
    `/organizer/update-status/${id}/${status}`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};
