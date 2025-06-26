import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TitleWrapper, StyledInput } from "../style";
import { Flex, Box, Button, Input, Icon } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { ComboBox } from "../../../components/ui/combobox";
import {
  LuUpload,
  LuCircleChevronLeft,
  LuMail,
  LuTrash2,
  LuLock,
  LuRotateCcw,
} from "react-icons/lu";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCreateAccount } from "../../../hooks/useAccount";

const CreateAccount = () => {
  const { mutateAsync: createAccount } = useCreateAccount({
    onError: (error) => {
      const errors = error?.response?.data?.errors;
      if (errors && typeof errors === "object") {
        setFieldErrors(errors);
      } else {
        const message =
          error?.response?.data?.error || error?.message || "Đã xảy ra lỗi";
        setFieldErrors({ form: message });
      }
    },
  });
  const [formData, setFormData] = useState({
    maVaiTro: "",
    email: "",
    matKhau: "",
    trangThai: "1",
  });
  const roleOptions = [
    { label: "Người dùng", value: "VT000004" },
    { label: "Tổ chức sự kiện", value: "VT000003" },
    { label: "Nhân viên", value: "VT000002" },
  ];
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const missingFields = Object.keys(formData).filter(
      (key) => !formData[key] || formData[key].trim() === ""
    );

    if (missingFields.length > 0) {
      setFieldErrors({ form: "Vui lòng nhập đủ các trường" });
      return;
    }

    try {
      console.log("Dữ liệu gửi lên API:", formData);
      await createAccount(formData);
      toast.success("Tạo tài khoản thành công!", {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
      });
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Lỗi không xác định";
      console.log("Lỗi khi tạo tài khoản:", message);
      toast.error("Tạo tài khoản thất bại!", {
        position: "top-right",
        autoClose: 1000,
      });
    }
  };

  return (
    <div>
      <Flex flexDirection="column">
        <TitleWrapper mb={12}>
          <Flex flexDirection="column">
            <Link to="/admin/account-manage">
              <Flex alignItems="center" gap={2}>
                <LuCircleChevronLeft />
                <p>Trở về danh sách</p>
              </Flex>
            </Link>

            <Flex className="title">
              <p>Tạo tài khoản</p>
            </Flex>
          </Flex>

          <Flex justifyContent="flex-end">
            <Button className="blue-btn" onClick={handleSubmit}>
              Tạo tài khoản
            </Button>
          </Flex>
        </TitleWrapper>

        <Box className="content">
          {fieldErrors.email && (
            <p style={{ color: "red" }}>{fieldErrors.email}</p>
          )}
          {fieldErrors.matKhau && (
            <p style={{ color: "red" }}>{fieldErrors.matKhau}</p>
          )}
          {fieldErrors.form && (
            <p style={{ color: "red" }}>{fieldErrors.form}</p>
          )}
          <form>
            <Flex flexDirection="column">
              <StyledInput templateColumns="1fr 3fr">
                <label htmlFor="email">Email</label>
                <InputGroup borderRadius="4px" width="70%">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </InputGroup>
              </StyledInput>

              <StyledInput templateColumns="1fr 3fr">
                <label htmlFor="password">Mật khẩu</label>
                <InputGroup borderRadius="4px" width="70%">
                  <input
                    id="password"
                    name="matKhau"
                    type="text"
                    value={formData.matKhau || ""}
                    onChange={handleChange}
                  />
                </InputGroup>
              </StyledInput>

              <StyledInput templateColumns="1fr 3fr">
                <label htmlFor="role">Loại tài khoản</label>
                <ComboBox
                  width="200px"
                  height="36px"
                  borderRadius="12px"
                  items={roleOptions}
                  value={formData.maVaiTro}
                  onChange={(selected) =>
                    handleChange({
                      target: { name: "maVaiTro", value: selected.value },
                    })
                  }
                />
              </StyledInput>
            </Flex>
          </form>
        </Box>
      </Flex>
    </div>
  );
};

export default CreateAccount;
