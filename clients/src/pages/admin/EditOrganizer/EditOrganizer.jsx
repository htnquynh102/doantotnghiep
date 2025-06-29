import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  TitleWrapper,
  StyledInput,
  AvatarWrapper,
  ImageContainer,
  EventImage,
  StatusWrapper,
  PopUp,
  PopupContent,
  NavButton,
  NavBar,
} from "../style";
import { Flex, Box, Button, Input, Icon } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { AddressSelector } from "../../../components/ui/select-address";
import { GenericTable } from "../../../components/ui/generic-table";
import rabbit from "../../../assets/images/rabbit.png";
import {
  LuUpload,
  LuCircleChevronLeft,
  LuMail,
  LuTrash2,
  LuLock,
  LuRotateCcw,
} from "react-icons/lu";
import {
  useOrganizerById,
  useUpdateOrganizer,
} from "../../../hooks/useOrganizer";
import { useEvents } from "../../../hooks/useEvent";
import { useUpdateAccountStatus } from "../../../hooks/useAccount";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditOrganizer = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { data: org, isLoading, isError, error } = useOrganizerById(accountId);
  const { data: events } = useEvents();
  const myEvents = useMemo(() => {
    if (!org || events?.length === 0) return [];
    return events?.filter((event) => event?.maCTySuKien === org?.maCTySuKien);
  }, [org, events]);
  const { mutateAsync: updateOrganizer } = useUpdateOrganizer();
  const { mutateAsync: updateAccountStatus } = useUpdateAccountStatus();
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("Thông tin công ty");

  console.log(myEvents);

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

  useEffect(() => {
    if (org) {
      setFormData({
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
      });
    }
  }, [org]);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (org?.anhDaiDien) {
      setPreview(org.anhDaiDien);
    } else {
      setPreview(rabbit);
    }
  }, [org?.anhDaiDien]);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateOrganizer({ id: accountId, data: form });

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

  // for (let pair of form.entries()) {
  //   console.log(pair[0], pair[1]);
  // }

  const columns = [
    {
      header: "Tên sự kiện",
      accessor: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={row.anhBia ? row.anhBia : no_img}
            alt={row.tenSuKien}
            style={{
              width: "60px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <p style={{ margin: 0 }}>{row.tenSuKien}</p>
        </div>
      ),
    },
    { header: "Công ty thực hiện", accessor: "tenCongTy" },
    {
      header: "Ngày đăng ký",
      accessor: (row) => {
        const date = new Date(row.ngayDangKy);
        return date.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      header: "Trạng thái duyệt",
      accessor: (row) => {
        const statusMap = {
          0: { label: "Chưa duyệt", color: "#ffbb54" },
          1: { label: "Đã duyệt", color: "#43a047" },
          2: { label: "Không duyệt", color: "#626461" },
        };
        const status = statusMap[row.trangThaiDuyet];

        return (
          <StatusWrapper
            style={{
              color: status.color,
              fontWeight: "600",
            }}
          >
            {status.label}
          </StatusWrapper>
        );
      },
    },
    {
      header: "Địa điểm",
      accessor: (row) => (
        <p>
          {row.diaDiemToChuc}, {row.soNhaDuong}, {row.tenPhuongXa},{" "}
          {row.tenQuanHuyen}, {row.tenTinhThanh}
        </p>
      ),
    },
    {
      header: "Thời gian tổ chức",
      accessor: (row) => {
        const date = new Date(row.thoiGianBatDau);
        return date.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
  ];

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <div>
      <Flex flexDirection="column">
        <TitleWrapper mb={12}>
          <Flex flexDirection="column">
            <Link
              to={
                org.trangThai === -1
                  ? "/admin/account-manage/deleted"
                  : "/admin/account-manage"
              }
            >
              <Flex alignItems="center" gap={2}>
                <LuCircleChevronLeft />
                <p>Trở về danh sách</p>
              </Flex>
            </Link>
            <Flex className="title">
              <p>Thông tin công ty tổ chức sự kiện</p>
            </Flex>
          </Flex>

          <Flex justifyContent="flex-end">
            <Flex gap={4}>
              {org.trangThai === -1 ? (
                <Button
                  className="gray-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowRestoreConfirm(true);
                  }}
                >
                  <Flex gap={2}>
                    <LuRotateCcw style={{ height: "16px" }} />
                    <p>Khôi phục </p>
                  </Flex>
                </Button>
              ) : org.trangThai === 0 ? (
                <Flex gap={4}>
                  <Button
                    className="blue-outline-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowActivateConfirm(true);
                    }}
                  >
                    <Flex gap={2}>
                      <LuLock style={{ height: "16px" }} />
                      <p>Kích hoạt</p>
                    </Flex>
                  </Button>
                  <Button
                    className="red-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Flex gap={2}>
                      <LuTrash2 style={{ height: "16px" }} />
                      <p>Xóa </p>
                    </Flex>
                  </Button>
                </Flex>
              ) : (
                <Flex gap={4}>
                  <Button
                    className="gray-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowLockConfirm(true);
                    }}
                  >
                    <Flex gap={2}>
                      <LuLock style={{ height: "16px" }} />
                      <p>Khóa tài khoản</p>
                    </Flex>
                  </Button>
                  <Button
                    className="red-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <Flex gap={2}>
                      <LuTrash2 style={{ height: "16px" }} />
                      <p>Xóa</p>
                    </Flex>
                  </Button>
                </Flex>
              )}

              <Button className="blue-btn" onClick={handleEditSubmit}>
                Lưu thông tin
              </Button>
            </Flex>
          </Flex>
        </TitleWrapper>

        <NavBar mb={12}>
          <NavButton
            isActive={activeTab === "Thông tin công ty"}
            onClick={() => setActiveTab("Thông tin công ty")}
          >
            Thông tin công ty
          </NavButton>
          <NavButton
            isActive={activeTab === "Tài khoản ngân hàng"}
            onClick={() => setActiveTab("Tài khoản ngân hàng")}
          >
            Tài khoản ngân hàng
          </NavButton>
          <NavButton
            isActive={activeTab === "Minh chứng"}
            onClick={() => setActiveTab("Minh chứng")}
          >
            Minh chứng
          </NavButton>
          <NavButton
            isActive={activeTab === "Lịch sử sự kiện"}
            onClick={() => setActiveTab("Lịch sử sự kiện")}
          >
            Lịch sử sự kiện
          </NavButton>
        </NavBar>

        <Box className="content">
          {activeTab === "Thông tin công ty" && (
            <>
              <Flex gap={4}>
                <Flex gap={2}>
                  <p>Mã tài khoản:</p>
                  <p>#{org.maTaiKhoan}</p>
                </Flex>
                <StatusWrapper
                  style={{
                    color:
                      org?.trangThai === -1
                        ? "#626461"
                        : org?.trangThai === 0
                        ? "#ffbb54"
                        : "#43a047",
                  }}
                >
                  {org?.trangThai === -1 && "Đã xóa"}
                  {org?.trangThai === 0 && "Chưa kích hoạt"}
                  {org?.trangThai === 1 && "Đang hoạt động"}
                </StatusWrapper>
              </Flex>

              <form>
                <Flex flexDirection="column">
                  <StyledInput templateColumns="1fr 3fr">
                    <label htmlFor="fullName">Tên công ty</label>
                    <InputGroup borderRadius="4px" width="70%">
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
                      />
                    </InputGroup>
                  </StyledInput>

                  <StyledInput templateColumns="1fr 3fr">
                    <label htmlFor="role">Loại tài khoản</label>
                    <InputGroup borderRadius="4px" width="70%">
                      <input
                        id="role"
                        type="role"
                        value="Công ty sự kiện"
                        disabled
                      />
                    </InputGroup>
                  </StyledInput>

                  <StyledInput templateColumns="1fr 3fr">
                    <label htmlFor="email">Email</label>
                    <InputGroup
                      borderRadius="4px"
                      width="70%"
                      startElement={
                        <Icon
                          as={LuMail}
                          style={{ fontSize: "16px", color: "#009fda" }}
                        />
                      }
                    >
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                      />
                    </InputGroup>
                  </StyledInput>

                  <StyledInput templateColumns="1fr 3fr">
                    <label htmlFor="phoneNumber">Số điện thoại</label>
                    <InputGroup borderRadius="4px" width="70%">
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
                  </StyledInput>

                  <StyledInput templateColumns="1fr 3fr">
                    <label htmlFor="avatar">Ảnh đại diện</label>
                    <AvatarWrapper>
                      <ImageContainer w="60px" h="60px">
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
                        <Button
                          className="upload-btn"
                          as="span"
                          colorScheme="teal"
                        >
                          <LuUpload />
                          Upload
                        </Button>
                      </label>
                    </AvatarWrapper>
                  </StyledInput>

                  <StyledInput templateColumns="1fr 3fr">
                    <label htmlFor="address">Địa chỉ</label>
                    <Flex flexDirection="column" gap={4}>
                      <InputGroup borderRadius="4px" width="70%">
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

                      <Box w="70%" className="address-selector">
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
                      </Box>
                    </Flex>
                  </StyledInput>
                </Flex>
              </form>
            </>
          )}

          {activeTab === "Tài khoản ngân hàng" && (
            <form>
              <Flex flexDirection="column">
                <StyledInput templateColumns="1fr 3fr">
                  <label htmlFor="bank-account">Chủ tài khoản thanh toán</label>
                  <InputGroup borderRadius="4px" width="70%">
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
                </StyledInput>

                <StyledInput templateColumns="1fr 3fr">
                  <label htmlFor="bank-number">Số tài khoản</label>
                  <InputGroup borderRadius="4px" width="70%">
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
                </StyledInput>

                <StyledInput templateColumns="1fr 3fr">
                  <label htmlFor="bank-name">Ngân hàng</label>
                  <InputGroup borderRadius="4px" width="70%">
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
                </StyledInput>

                <StyledInput templateColumns="1fr 3fr">
                  <label htmlFor="bank-branch">Chi nhánh ngân hàng</label>
                  <InputGroup borderRadius="4px" width="70%">
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
                </StyledInput>
              </Flex>
            </form>
          )}

          {activeTab === "Minh chứng" && (
            <Flex
              className="file-attached"
              flexDirection="column"
              mt="22px"
              height="100vh"
            >
              {org?.giayPhepKinhDoanh ? (
                <Box className="attached-file" h="100%">
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      org.giayPhepKinhDoanh
                    )}&embedded=true`}
                    width="80%"
                    height="100%"
                  ></iframe>
                </Box>
              ) : (
                <p style={{ color: "#626461", fontStyle: "italic" }}>
                  Chưa cung cấp minh chứng
                </p>
              )}
            </Flex>
          )}

          {activeTab === "Lịch sử sự kiện" && (
            <>
              {myEvents.length === 0 ? (
                <p>Chưa có lịch sử sự kiện nào.</p>
              ) : (
                <Box
                  style={{ border: "1px solid #ccc", borderRadius: "10px" }}
                  p="12px"
                >
                  <GenericTable columns={columns} data={myEvents} />
                </Box>
              )}
            </>
          )}
        </Box>

        {showDeleteConfirm && (
          <PopUp>
            <PopupContent>
              {!actionSuccess ? (
                <>
                  <p>Bạn chắc chắn xóa tài khoản này?</p>
                  <Flex gap="10px" mt="20px" justifyContent="center">
                    <Button
                      onClick={async () => {
                        await updateAccountStatus({
                          id: org.maTaiKhoan,
                          status: -1,
                        });
                        setActionSuccess(true);

                        setTimeout(() => {
                          setShowDeleteConfirm(false);
                          setActionSuccess(false);
                          navigate(`/admin/account-manage`);
                        }, 2000);
                      }}
                      className="blue-btn"
                    >
                      Xác nhận
                    </Button>

                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="red-btn"
                    >
                      Huỷ
                    </Button>
                  </Flex>
                </>
              ) : (
                <p>Đã xóa {org.maTaiKhoan}</p>
              )}
            </PopupContent>
          </PopUp>
        )}
        {showRestoreConfirm && (
          <PopUp>
            <PopupContent>
              {!actionSuccess ? (
                <>
                  <p>Khôi phục tài khoản này?</p>
                  <Flex gap="10px" mt="20px" justifyContent="center">
                    <Button
                      onClick={async () => {
                        await updateAccountStatus({
                          id: org.maTaiKhoan,
                          status: 1,
                        });
                        setActionSuccess(true);

                        setTimeout(() => {
                          setShowRestoreConfirm(false);
                          setActionSuccess(false);
                        }, 2000);
                      }}
                      className="blue-btn"
                    >
                      Xác nhận
                    </Button>

                    <Button
                      onClick={() => setShowRestoreConfirm(false)}
                      className="red-btn"
                    >
                      Huỷ
                    </Button>
                  </Flex>
                </>
              ) : (
                <p>Đã khôi phục tài khoản {org.maTaiKhoan}</p>
              )}
            </PopupContent>
          </PopUp>
        )}
        {showLockConfirm && (
          <PopUp>
            <PopupContent>
              {!actionSuccess ? (
                <>
                  <p>Khóa tài khoản này?</p>
                  <Flex gap="10px" mt="20px" justifyContent="center">
                    <Button
                      onClick={async () => {
                        await updateAccountStatus({
                          id: org.maTaiKhoan,
                          status: 0,
                        });
                        setActionSuccess(true);

                        setTimeout(() => {
                          setShowLockConfirm(false);
                          setActionSuccess(false);
                        }, 2000);
                      }}
                      className="blue-btn"
                    >
                      Xác nhận
                    </Button>

                    <Button
                      onClick={() => setShowLockConfirm(false)}
                      className="red-btn"
                    >
                      Huỷ
                    </Button>
                  </Flex>
                </>
              ) : (
                <p>Đã khóa tài khoản {org.maTaiKhoan}</p>
              )}
            </PopupContent>
          </PopUp>
        )}
        {showActivateConfirm && (
          <PopUp>
            <PopupContent>
              {!actionSuccess ? (
                <>
                  <p>Kích hoạt tài khoản này?</p>
                  <Flex gap="10px" mt="20px" justifyContent="center">
                    <Button
                      onClick={async () => {
                        await showActivateConfirm({
                          id: org.maTaiKhoan,
                          status: 1,
                        });
                        setActionSuccess(true);

                        setTimeout(() => {
                          setShowActivateConfirm(false);
                          setActionSuccess(false);
                        }, 2000);
                      }}
                      className="blue-btn"
                    >
                      Xác nhận
                    </Button>

                    <Button
                      onClick={() => setShowActivateConfirm(false)}
                      className="red-btn"
                    >
                      Huỷ
                    </Button>
                  </Flex>
                </>
              ) : (
                <p>Đã kích hoạt tài khoản {org.maTaiKhoan}</p>
              )}
            </PopupContent>
          </PopUp>
        )}
      </Flex>
    </div>
  );
};

export default EditOrganizer;
