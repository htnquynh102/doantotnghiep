import { useState, useEffect } from "react";
import { ComboBox } from "./combobox";
import { Grid, GridItem, Flex } from "@chakra-ui/react";
import {
  useProvinces,
  useDistrictsByProvince,
  useWardsByDistrict,
  useWardInfo,
} from "../../hooks/useAddress";

export const AddressSelector = ({ initialWardId, onWardSelect }) => {
  const { data: wardInfo } = useWardInfo(initialWardId);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistrictsByProvince(
    selectedProvince?.value
  );
  const { data: wards = [] } = useWardsByDistrict(selectedDistrict?.value);

  const formattedProvinces = provinces.map((province) => ({
    value: province.maTinhThanh,
    label: province.tenTinhThanh,
  }));

  const formattedDistricts = districts.map((district) => ({
    value: district.maQuanHuyen,
    label: district.tenQuanHuyen,
  }));

  const formattedWards = wards.map((ward) => ({
    value: ward.maPhuongXa,
    label: ward.tenPhuongXa,
  }));

  useEffect(() => {
    if (wardInfo) {
      setSelectedProvince({
        value: wardInfo.maTinhThanh,
        label: wardInfo.tenTinhThanh,
      });

      setSelectedDistrict({
        value: wardInfo.maQuanHuyen,
        label: wardInfo.tenQuanHuyen,
      });

      setSelectedWard({
        value: wardInfo.maPhuongXa,
        label: wardInfo.tenPhuongXa,
      });
    }
  }, [wardInfo]);

  const handleProvinceChange = (value) => {
    const province = formattedProvinces.find((p) => p.value === value.value);
    if (province) {
      setSelectedProvince(province);
      setSelectedDistrict(null);
      setSelectedWard(null);
      onWardSelect?.(null);
    }
  };

  const handleDistrictChange = (value) => {
    const district = formattedDistricts.find((d) => d.value === value.value);
    if (district) {
      setSelectedDistrict(district);
      setSelectedWard(null);
      onWardSelect?.(null);
    }
  };

  const handleWardChange = (value) => {
    if (value) {
      setSelectedWard(value);
      onWardSelect?.(value.value);
    }
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
      <GridItem>
        <label>Tỉnh / Thành phố</label>
        <ComboBox
          width="100%"
          items={formattedProvinces}
          value={selectedProvince}
          onChange={handleProvinceChange}
        />
      </GridItem>

      <GridItem>
        <label>Quận / Huyện</label>
        <ComboBox
          width="100%"
          items={formattedDistricts}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        />
      </GridItem>

      <GridItem>
        <label>Phường / Xã</label>
        <ComboBox
          width="100%"
          items={formattedWards}
          value={selectedWard}
          onChange={handleWardChange}
          disabled={!selectedDistrict}
        />
      </GridItem>
    </Grid>
  );
};
