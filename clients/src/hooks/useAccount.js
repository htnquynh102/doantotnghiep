import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import {
  getAllAccounts,
  login,
  createAccount,
  updateAccountStatus,
} from "../services/accountService";

export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("user_email") || ""
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("user_role") || ""
  );

  const [accountId, setAccountId] = useState(
    localStorage.getItem("account_id") || ""
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedEmail = localStorage.getItem("user_email");
    const storedRole = localStorage.getItem("user_role");
    const storedId = localStorage.getItem("account_id");

    if (token) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail || "");
      setUserRole(storedRole || "");
      setAccountId(storedId || "");
    }
  }, []);

  const handleLogin = async (email, matKhau) => {
    setLoading(true);
    setError(null);
    const result = await login(email, matKhau);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      setIsAuthenticated(false);
      return null;
    }

    localStorage.setItem("access_token", result.token);
    localStorage.setItem("user_email", result.account.email);
    localStorage.setItem("user_role", result.account.maVaiTro);
    localStorage.setItem("account_id", result.account.maTaiKhoan);

    setUserEmail(result.account.email);
    setUserRole(result.account.role);
    setAccountId(result.account.maTaiKhoan);
    setIsAuthenticated(true);
    return result;
  };

  const logout = async () => {
    try {
      await axiosInstance.post(
        "/account/log-out",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("access_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_role");
      localStorage.removeItem("account_id");

      setIsAuthenticated(false);
      setUserEmail(null);
      setUserRole(null);
      setAccountId(null);

      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return {
    handleLogin,
    loading,
    error,
    isAuthenticated,
    userEmail,
    userRole,
    accountId,
    logout,
  };
};

export const useCreateAccount = (options = {}) => {
  return useMutation({
    mutationFn: createAccount,
    ...options,
  });
};

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateAccountStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts"]);
    },
    onError: (error) => {
      console.error("Cập nhật thất bại:", error);
    },
  });
};
