import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: "http://localhost:3001/api/v1",
  withCredentials: true, // Gửi kèm cookie nếu backend dùng refresh token dạng cookie
});

// Gắn access token vào mỗi request nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý token hết hạn (401) và thử refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       try {
//         const res = await axios.post(
//           `${import.meta.env.VITE_API_URL}/user/refresh-token`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = res.data.access_token;
//         localStorage.setItem("access_token", newAccessToken);

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
