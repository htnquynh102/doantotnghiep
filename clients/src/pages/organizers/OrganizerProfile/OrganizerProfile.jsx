import { useState, useEffect } from "react";
import {
  StyledFlex,
  ImageContainer,
  EventImage,
  PopUp,
  PopupContent,
  InfoWrapper,
} from "./style";
import {
  Flex,
  Box,
  Grid,
  Button,
  Input,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { FileUploadSection } from "../../../components/ui/file-upload";
import { AddressSelector } from "../../../components/ui/select-address";
import no_img from "../../../assets/images/no_img.png";
import { LuInfo, LuTickets, LuCamera } from "react-icons/lu";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../hooks/useAccount";
import {
  useOrganizerById,
  useUpdateOrganizer,
} from "../../../hooks/useOrganizer";

const OrganizerProfile = () => {
  const { accountId } = useAuth();
  const { data: org, isLoading, isError, error } = useOrganizerById(accountId);
  const [originalData, setOriginalData] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [preview, setPreview] = useState(no_img);
  const [formData, setFormData] = useState({
    email: "",
    tenCongTy: "",
    soDienThoai: "",
    diaChiCongTy: "",
    maPhuongXa: "",
    giayPhepKinhDoanh: "",
    chuTaiKhoanThanhToan: "",
    soTaiKhoan: "",
    tenNganHang: "",
    chiNhanhNganHang: "",
    anhDaiDien: "",
    trangThaiDuyet: "",
  });

  const requiredFields = [
    "tenCongTy",
    "soDienThoai",
    "diaChiCongTy",
    "maPhuongXa",
    "giayPhepKinhDoanh",
    "chuTaiKhoanThanhToan",
    "soTaiKhoan",
    "tenNganHang",
    "chiNhanhNganHang",
    "anhDaiDien",
  ];

  useEffect(() => {
    if (org) {
      const initialData = {
        email: org?.email || "",
        tenCongTy: org?.tenCongTy || "",
        soDienThoai: org?.soDienThoai || "",
        diaChiCongTy: org?.diaChiCongTy || "",
        maPhuongXa: org?.maPhuongXa || "",
        giayPhepKinhDoanh: org?.giayPhepKinhDoanh || "",
        chuTaiKhoanThanhToan: org?.chuTaiKhoanThanhToan || "",
        soTaiKhoan: org?.soTaiKhoan || "",
        tenNganHang: org?.tenNganHang || "",
        chiNhanhNganHang: org?.chiNhanhNganHang || "",
        anhDaiDien: org?.anhDaiDien || "",
        trangThaiDuyet: org?.trangThaiDuyet ?? null,
      };

      setOriginalData(initialData);
      setFormData(initialData);
      setPreview(initialData.anhDaiDien || no_img);
    }
  }, [org]);

  useEffect(() => {
    if (org?.anhDaiDien) {
      setPreview(org.anhDaiDien);
    } else {
      setPreview(no_img);
    }
  }, [org?.anhDaiDien]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected Image:", file);
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

  const handleFilesChange = (files) => {
    const lastFile = files.length > 0 ? files[files.length - 1] : null;

    if (!lastFile || !(lastFile instanceof File)) {
      return;
    }

    console.log("file  nè:", lastFile.name);

    setFormData((prev) => ({
      ...prev,
      giayPhepKinhDoanh: lastFile,
    }));
  };

  const form = new FormData();
  form.append("tenCongTy", formData.tenCongTy);
  form.append("soDienThoai", formData.soDienThoai);
  form.append("diaChiCongTy", formData.diaChiCongTy);
  form.append("maPhuongXa", formData.maPhuongXa);
  form.append("chuTaiKhoanThanhToan", formData.chuTaiKhoanThanhToan);
  form.append("soTaiKhoan", formData.soTaiKhoan);
  form.append("tenNganHang", formData.tenNganHang);
  form.append("chiNhanhNganHang", formData.chiNhanhNganHang);

  if (formData.anhDaiDien instanceof File) {
    form.append("type", "organizer");
    form.append("anhDaiDien", formData.anhDaiDien);
  } else if (
    typeof formData.anhDaiDien === "string" &&
    formData.anhDaiDien.startsWith("http")
  ) {
    form.append("anhDaiDien", formData.anhDaiDien);
  }

  if (formData.giayPhepKinhDoanh instanceof File) {
    form.append("giayPhepKinhDoanh", formData.giayPhepKinhDoanh);
  }

  const trangThaiDuyetMoi =
    formData.trangThaiDuyet === null || formData.trangThaiDuyet === 2
      ? 0
      : formData.trangThaiDuyet;

  form.append("trangThaiDuyet", Number(trangThaiDuyetMoi));

  console.log("Dữ liệu FormData sau khi append:");
  for (let [key, value] of form.entries()) {
    console.log(key, value);
  }
  console.log("Require");
  requiredFields.forEach((field) => {
    console.log(field, formData[field]);
  });

  const isValid =
    org.trangThaiDuyet === 1 ||
    ((!org.trangThaiDuyet ||
      ["0", "2"].includes(org.trangThaiDuyet?.toString())) &&
      requiredFields.every((field) => {
        const value = formData[field];
        return (
          value instanceof File ||
          (typeof value === "string" && value.trim() !== "") ||
          typeof value === "number"
        );
      }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  const { mutateAsync: updateOrganizer } = useUpdateOrganizer();
  const handleConfirm = async () => {
    try {
      await updateOrganizer({ id: accountId, data: form });

      toast.success("Cập nhật thành công!", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
      });

      setShowConfirm(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  const handleCancel = () => {
    if (trangThaiDuyetMoi === 0) {
      setShowConfirm(false);
    } else {
      setFormData(originalData);
      setPreview(originalData.anhDaiDien || no_img);
      setShowConfirm(false);
    }
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <div>
      <StyledFlex gap={8}>
        <Flex className="title">
          <p>Cập nhật hồ sơ</p>
        </Flex>

        <Flex className="content" flexDirection="column">
          <InfoWrapper className="event-info">
            <form className="signin-form" onSubmit={handleSubmit}>
              <Flex justifyContent="space-between" align="center" mb="32px">
                <Flex alignItems="center" gap={2}>
                  <LuInfo />
                  {org.trangThaiDuyet === null
                    ? "Bắt buộc điền đầy đủ thông tin trước khi gửi"
                    : org.trangThaiDuyet === 0
                    ? "Đang đợi xác nhận từ hệ thống"
                    : org.trangThaiDuyet === 1
                    ? "Thông tin đã được xác nhận bởi hệ thống"
                    : "Thông tin này không được phê duyệt"}
                </Flex>

                <Button className="blue-btn" type="submit" disabled={!isValid}>
                  {org.trangThaiDuyet === null
                    ? " Nộp thông tin"
                    : org.trangThaiDuyet === 0
                    ? "Cập nhật"
                    : org.trangThaiDuyet === 1
                    ? "Cập nhật"
                    : "Nộp lại thông tin"}
                </Button>
              </Flex>

              <Flex flexDirection="column" gap={12}>
                <Box w="100%" className="info-details">
                  <Flex alignItems="center" gap={2} mb={8}>
                    <Box borderRadius="50%" bg="#FFF4CF" p={2}>
                      <LuInfo />
                    </Box>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "#303030",
                        fontWeight: "600",
                      }}
                    >
                      Thông tin công ty
                    </p>
                  </Flex>

                  <Grid templateColumns="1fr 2fr">
                    <GridItem>
                      <Flex flexDirection="column" alignItems="center" gap={6}>
                        <ImageContainer position="relative">
                          <EventImage src={preview} w="160px" />
                          <label htmlFor="file-upload">
                            {formData.trangThaiDuyet !== 0 && (
                              <Button
                                w="50px"
                                h="50px"
                                className="upload-btn"
                                as="span"
                                position="absolute"
                                bottom="0"
                                right="0"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                                  borderRadius: "50%",
                                  color: "rgb(255, 212, 84)",
                                }}
                              >
                                <LuCamera />
                              </Button>
                            )}
                          </label>
                        </ImageContainer>

                        <Input
                          type="file"
                          id="file-upload"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleImageChange}
                          mt={3}
                          bg="white"
                          style={{ display: "none" }}
                        />
                      </Flex>

                      {(org?.trangThaiDuyet === null ||
                        org?.trangThaiDuyet === 2) && (
                        <div>
                          <Flex alignItems="center" gap={2}>
                            <LuInfo />
                            Vui lòng tải lên tài liệu xác minh
                          </Flex>
                          <p>
                            Hồ sơ của bạn chưa được duyệt. Để tiếp tục, vui lòng
                            cung cấp giấy phép kinh doanh của công ty.
                          </p>

                          <FileUploadSection
                            onFilesChange={handleFilesChange}
                            maxFiles={1}
                          />
                        </div>
                      )}
                    </GridItem>

                    <Flex flexDirection="column" gap={8}>
                      <SimpleGrid columns={2} gap={8}>
                        <Flex flexDirection="column" gap={1}>
                          <label htmlFor="fullName">
                            Tên công ty / tổ chức
                          </label>
                          <InputGroup>
                            <input
                              id="fullName"
                              type="text"
                              value={formData.tenCongTy}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  tenCongTy: e.target.value,
                                })
                              }
                              disabled={formData.trangThaiDuyet === 1}
                            />
                          </InputGroup>
                        </Flex>

                        <Flex flexDirection="column" gap={1}>
                          <label htmlFor="phoneNumber">Số điện thoại</label>
                          <InputGroup>
                            <input
                              id="phoneNumber"
                              type="text"
                              maxLength={10}
                              value={formData.soDienThoai}
                              onChange={(e) => {
                                const inputValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                setFormData({
                                  ...formData,
                                  soDienThoai: inputValue,
                                });
                              }}
                            />
                          </InputGroup>
                        </Flex>

                        <Flex flexDirection="column" gap={1}>
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

                        <Flex flexDirection="column" gap={1}>
                          <label htmlFor="address">Địa chỉ</label>
                          <InputGroup>
                            <input
                              id="address"
                              type="text"
                              value={formData.diaChiCongTy}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  diaChiCongTy: e.target.value,
                                })
                              }
                            />
                          </InputGroup>
                        </Flex>
                      </SimpleGrid>

                      <AddressSelector
                        initialWardId={formData.maPhuongXa}
                        onWardSelect={(value) => {
                          setFormData((prev) => ({
                            ...prev,
                            maPhuongXa: value,
                          }));
                        }}
                      />
                    </Flex>
                  </Grid>
                </Box>

                <Box w="100%" className="info-details">
                  <Flex alignItems="center" gap={2} mb={8}>
                    <Box borderRadius="50%" bg="#E5F9D2" p={2}>
                      <LuTickets />
                    </Box>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "#303030",
                        fontWeight: "600",
                      }}
                    >
                      Thông tin tài khoản ngân hàng
                    </p>
                  </Flex>

                  <SimpleGrid columns={2} gap={8}>
                    <Flex flexDirection="column" gap={2}>
                      <label htmlFor="bank-account">
                        Chủ tài khoản thanh toán
                      </label>
                      <InputGroup>
                        <input
                          id="bank-account"
                          type="text"
                          value={formData.chuTaiKhoanThanhToan}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chuTaiKhoanThanhToan: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Flex>

                    <Flex flexDirection="column" gap={2}>
                      <label htmlFor="bank-number">Số tài khoản</label>
                      <InputGroup>
                        <input
                          id="bank-number"
                          type="text"
                          value={formData.soTaiKhoan}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              soTaiKhoan: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Flex>

                    <Flex flexDirection="column" gap={2}>
                      <label htmlFor="bank-name">Ngân hàng</label>
                      <InputGroup>
                        <input
                          id="bank-name"
                          type="text"
                          value={formData.tenNganHang}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tenNganHang: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Flex>

                    <Flex flexDirection="column" gap={2}>
                      <label htmlFor="bank-branch">Chi nhánh ngân hàng</label>
                      <InputGroup>
                        <input
                          id="bank-branch"
                          type="text"
                          value={formData.chiNhanhNganHang}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              chiNhanhNganHang: e.target.value,
                            })
                          }
                        />
                      </InputGroup>
                    </Flex>
                  </SimpleGrid>
                </Box>
              </Flex>
            </form>
          </InfoWrapper>
        </Flex>

        {showConfirm && (
          <PopUp>
            <PopupContent>
              <p>Bạn có chắc chắn muốn gửi thông tin không?</p>
              <Flex gap="10px" mt="20px" justifyContent="center">
                <Button onClick={handleConfirm} className="blue-btn">
                  Xác nhận
                </Button>
                <Button onClick={handleCancel} className="red-btn">
                  Huỷ
                </Button>
              </Flex>
            </PopupContent>
          </PopUp>
        )}
      </StyledFlex>
    </div>
  );
};

export default OrganizerProfile;
