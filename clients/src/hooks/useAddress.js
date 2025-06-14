import { useQuery } from "@tanstack/react-query";
import {
  getAllProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
  getWardInfo,
} from "../services/addressService";

export const useProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: getAllProvinces,
  });
};

export const useDistrictsByProvince = (provinceId) => {
  return useQuery({
    queryKey: ["districts", provinceId],
    queryFn: () => getDistrictsByProvince(provinceId),
    enabled: !!provinceId,
  });
};

export const useWardsByDistrict = (districtId) => {
  return useQuery({
    queryKey: ["wards", districtId],
    queryFn: () => getWardsByDistrict(districtId),
    enabled: !!districtId,
  });
};

export const useWardInfo = (wardId) => {
  return useQuery({
    queryKey: ["wardInfo", wardId],
    queryFn: async () => {
      if (!wardId) return {};
      return getWardInfo(wardId);
    },
    enabled: !!wardId,
  });
};
