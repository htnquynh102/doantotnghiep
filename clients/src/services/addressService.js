import axiosInstance from "../utils/axios";

export const getAllProvinces = async () => {
  const res = await axiosInstance.get("/address/get-all-province");
  return res.data?.data || [];
};

export const getDistrictsByProvince = async (provinceId) => {
  // console.log("🛠 Province ID before API call:", provinceId);
  const res = await axiosInstance.get(
    `/address/get-district-by-province/${provinceId}`
  );
  return res.data?.data || [];
};

export const getWardsByDistrict = async (districtId) => {
  // console.log("🛠 District ID before API call:", districtId);
  const res = await axiosInstance.get(
    `/address/get-ward-by-district/${districtId}`
  );

  return res.data?.data || [];
};

export const getWardInfo = async (wardId) => {
  // console.log("Calling API with wardId:", wardId);
  const res = await axiosInstance.get(`/address/get-ward-info/${wardId}`);
  // console.log("API Response:", res.data);
  return res.data?.[0] || {};
};
