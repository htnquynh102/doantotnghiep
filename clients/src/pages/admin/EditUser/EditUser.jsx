import { useState, useEffect } from "react";
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
} from "../style";
import { Flex, Box, Button, Input, Icon } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { AddressSelector } from "../../../components/ui/select-address";
import rabbit from "../../../assets/images/rabbit.png";
import {
  LuUpload,
  LuCircleChevronLeft,
  LuMail,
  LuTrash2,
  LuLock,
  LuRotateCcw,
} from "react-icons/lu";
import { useUserById, useUpdateUser } from "../../../hooks/useUser";
import { useUpdateAccountStatus } from "../../../hooks/useAccount";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUser = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { data: user, isLoading, isError, error } = useUserById(accountId);
  const { mutateAsync: updateAccountStatus } = useUpdateAccountStatus();
  const { mutateAsync: updateUser } = useUpdateUser();
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showLockConfirm, setShowLockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

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
      setPreview(rabbit);
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
  form.append("ngaySinh", formData.ngaySinh?.split("T")[0]);
  form.append("gioiTinh", parseInt(formData.gioiTinh, 10));
  form.append("diaChi", formData.diaChi);
  form.append("maPhuongXa", formData.maPhuongXa);
  form.append("type", "user");
  if (formData.anhDaiDien instanceof File) {
    form.append("anhDaiDien", formData.anhDaiDien);
  }

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

  for (let pair of form.entries()) {
    console.log(pair[0], pair[1]);
  }

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <div>
      <Flex flexDirection="column">
        <TitleWrapper mb={12}>
          <Flex flexDirection="column">
            <Link
              to={
                user.trangThai === -1
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
              <p>Thông tin người dùng</p>
            </Flex>
          </Flex>

          <Flex justifyContent="flex-end">
            <Flex gap={4}>
              {user.trangThai === -1 ? (
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
              ) : user.trangThai === 0 ? (
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

        <Flex gap={4}>
          <Flex gap={2}>
            <p>Mã tài khoản:</p>
            <p>#{user.maTaiKhoan}</p>
            <p>Ngày tạo: {new Date(user.ngayTao).toLocaleString("vi-VN")}</p>
          </Flex>
          <StatusWrapper
            style={{
              color:
                user?.trangThai === -1
                  ? "#626461"
                  : user?.trangThai === 0
                  ? "#ffbb54"
                  : "#43a047",
            }}
          >
            {user?.trangThai === -1 && "Đã xóa"}
            {user?.trangThai === 0 && "Chưa kích hoạt"}
            {user?.trangThai === 1 && "Đang hoạt động"}
          </StatusWrapper>
        </Flex>

        <Box className="content">
          <form>
            <Flex flexDirection="column">
              <StyledInput templateColumns="1fr 3fr">
                <label htmlFor="fullName">Họ và tên</label>
                <InputGroup borderRadius="4px" width="70%">
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
              </StyledInput>

              <StyledInput templateColumns="1fr 3fr">
                <label htmlFor="role">Loại tài khoản</label>
                <InputGroup borderRadius="4px" width="70%">
                  <input id="role" type="role" value="Người dùng" disabled />
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
                    <Button className="upload-btn" as="span" colorScheme="teal">
                      <LuUpload />
                      Upload
                    </Button>
                  </label>
                </AvatarWrapper>
              </StyledInput>

              <StyledInput templateColumns="1fr 3fr">
                <label htmlFor="gender">Giới tính</label>

                <Box w="50%">
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
              </StyledInput>

              <StyledInput templateColumns="1fr 3fr">
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
              </StyledInput>

              <StyledInput templateColumns="1fr 3fr">
                <label htmlFor="address">Địa chỉ</label>
                <Flex flexDirection="column" gap={4}>
                  <InputGroup borderRadius="4px" width="70%">
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
                          id: user.maTaiKhoan,
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
                <p>Đã xóa {user.maTaiKhoan}</p>
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
                          id: user.maTaiKhoan,
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
                <p>Đã khôi phục tài khoản {user.maTaiKhoan}</p>
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
                          id: user.maTaiKhoan,
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
                <p>Đã khóa tài khoản {user.maTaiKhoan}</p>
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
                          id: user.maTaiKhoan,
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
                <p>Đã kích hoạt tài khoản {user.maTaiKhoan}</p>
              )}
            </PopupContent>
          </PopUp>
        )}
      </Flex>
    </div>
  );
};

export default EditUser;
