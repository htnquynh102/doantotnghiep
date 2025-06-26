import { useState, useEffect } from "react";
import { StyledFlex, ImageContainer, EventImage } from "./style";
import { Flex, Box, Grid, Button, Input } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { ComboBox } from "../../../components/ui/combobox";
import { AddressSelector } from "../../../components/ui/select-address";
import rabbit from "../../../assets/images/rabbit.png";
import { LuUpload } from "react-icons/lu";
import { useAuth } from "../../../hooks/useAccount";
import { useUserById, useUpdateUser } from "../../../hooks/useUser";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const { accountId } = useAuth();
  const { data: user, isLoading, isError, error } = useUserById(accountId);
  console.log(user);

  const [formData, setFormData] = useState({
    email: "",
    tenNguoiThamGia: "",
    soDienThoai: "",
    ngaySinh: "",
    gioiTinh: "",
    diaChi: "",
    maPhuongXa: "",
    anhDaiDien: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user?.email || "",
        tenNguoiThamGia: user?.tenNguoiThamGia || "",
        soDienThoai: user?.soDienThoai || "",
        ngaySinh: user?.ngaySinh || "",
        gioiTinh: user?.gioiTinh?.toString() || "",
        diaChi: user?.diaChi || "",
        maPhuongXa: user?.maPhuongXa || "",
        anhDaiDien: user?.anhDaiDien || "",
      });
    }
  }, [user]);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user?.anhDaiDien) {
      setPreview(user.anhDaiDien);
    } else {
      setPreview(rabbit); // ảnh mặc định nếu chưa có
    }
  }, [user?.anhDaiDien]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log("Reader result:", reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({
      ...prev,
      anhDaiDien: file,
    }));
  };

  const form = new FormData();

  form.append("tenNguoiThamGia", formData.tenNguoiThamGia);
  form.append("soDienThoai", formData.soDienThoai);
  form.append("ngaySinh", formData.ngaySinh?.split("T")[0] || "");
  form.append("gioiTinh", parseInt(formData.gioiTinh, 10));
  form.append("diaChi", formData.diaChi);
  form.append("maPhuongXa", formData.maPhuongXa);
  form.append("type", "user");
  if (formData.anhDaiDien instanceof File) {
    form.append("anhDaiDien", formData.anhDaiDien);
  }

  const { mutateAsync: updateUser } = useUpdateUser();
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser({ id: accountId, data: form });

      toast.success("Cập nhật thành công!", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <div>
      <StyledFlex>
        <Box className="title">
          <p>Thông tin tài khoản</p>
        </Box>

        <Box className="content">
          <form>
            <Grid templateColumns="3fr 1fr">
              <Box className="input-info">
                <Flex flexDirection="column" gap={4}>
                  <Flex flexDirection="column" gap={2}>
                    <label htmlFor="fullName">Họ và tên</label>
                    <InputGroup>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.tenNguoiThamGia}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tenNguoiThamGia: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </Flex>

                  <Flex flexDirection="column" gap={2}>
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <InputGroup>
                      <input
                        id="phoneNumber"
                        type="text"
                        maxLength={10}
                        value={formData.soDienThoai}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, "");
                          setFormData({
                            ...formData,
                            soDienThoai: inputValue,
                          });
                        }}
                      />
                    </InputGroup>
                  </Flex>

                  <Flex flexDirection="column" gap={2}>
                    <label htmlFor="email">Email</label>
                    <InputGroup>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                      />
                    </InputGroup>
                  </Flex>

                  <Flex justifyContent="space-between" gap={2}>
                    <Box w="50%">
                      <label htmlFor="gender">Giới tính</label>
                      <Flex
                        className="gender-option"
                        gap={7}
                        alignItems="center"
                        style={{ height: "48px" }}
                      >
                        <label>
                          <input
                            type="radio"
                            name="gioiTinh"
                            value="0"
                            checked={formData.gioiTinh === "0"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gioiTinh: e.target.value,
                              })
                            }
                            style={{ marginRight: "6px" }}
                          />
                          Nam
                        </label>

                        <label>
                          <input
                            type="radio"
                            name="gioiTinh"
                            value="1"
                            checked={formData.gioiTinh === "1"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gioiTinh: e.target.value,
                              })
                            }
                            style={{ marginRight: "6px" }}
                          />
                          Nữ
                        </label>
                      </Flex>
                    </Box>
                    <Flex flexDirection="column" w="50%">
                      <label htmlFor="birth">Ngày sinh</label>
                      <DatePicker
                        className="date-picker"
                        selected={
                          formData.ngaySinh ? new Date(formData.ngaySinh) : null
                        }
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) =>
                          setFormData({
                            ...formData,
                            ngaySinh: date.toISOString(),
                          })
                        }
                      />
                    </Flex>
                  </Flex>

                  <Flex flexDirection="column" gap={2}>
                    <label htmlFor="address">Địa chỉ</label>
                    <InputGroup>
                      <input
                        id="address"
                        type="text"
                        value={formData.diaChi}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            diaChi: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </Flex>

                  <AddressSelector
                    initialWardId={formData.maPhuongXa}
                    onWardSelect={(value) => {
                      console.log("Ward selected in parent:", value);
                      setFormData((prev) => ({
                        ...prev,
                        maPhuongXa: value,
                      }));
                    }}
                  />
                </Flex>
              </Box>
              <Box className="input-avatar" p={4}>
                <ImageContainer w="160px" h="160px">
                  <EventImage src={preview} w="160px" />
                </ImageContainer>

                <Input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  mt={3}
                  bg="white"
                  style={{ display: "none" }}
                />

                <label htmlFor="file-upload">
                  <Button className="upload-btn" as="span" colorScheme="teal">
                    <LuUpload />
                    Upload
                  </Button>
                </label>
              </Box>
            </Grid>
            <StyledFlex alignItems="center">
              <Button
                className="blue-btn"
                borderRadius="20px"
                type="submit"
                w="200px"
                onClick={handleEditSubmit}
              >
                Cập nhật
              </Button>
            </StyledFlex>
          </form>
        </Box>
      </StyledFlex>
    </div>
  );
};

export default UserProfile;
