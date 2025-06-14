import axiosInstance from "../utils/axios";

export const getAllCategories = async () => {
  const res = await axiosInstance.get("/category/get-all");
  return res.data?.data || [];
};

export const createCategory = async (data) => {
  const res = await axiosInstance.post("/category/create-category", data);
  return res.data;
};

export const updateCategory = async (id, data) => {
  const res = await axiosInstance.put(`/category/update-category/${id}`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const updateCategoryStatus = async (id, status) => {
  const res = await axiosInstance.patch(
    `/category/update-status/${id}/${status}`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};
