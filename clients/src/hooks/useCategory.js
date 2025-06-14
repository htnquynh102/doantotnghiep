import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
} from "../services/categoryService";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
};

export const useCategoriesForSelect = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    select: (data) =>
      data.map((category) => ({
        value: category.maDanhMuc,
        label: category.tenDanhMuc,
      })),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Tạo danh mục thất bại:", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};

export const useUpdateCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateCategoryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};
