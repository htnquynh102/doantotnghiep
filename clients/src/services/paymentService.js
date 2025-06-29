import axiosInstance from "../utils/axios";

export const createPayment = async ({ maDonDatVe, tongTien }) => {
  const res = await axiosInstance.post("/payment/create", {
    maDonDatVe: maDonDatVe,
    tongTien: tongTien,
  });
  return res.data;
};
