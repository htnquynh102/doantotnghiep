import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button, Grid, GridItem, Icon } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { OTPForm } from "../../../components/OTPForm/OTPForm";
import { ContentWrapper, PopUp, PopupContent } from "../style";
import { LuMail, LuLock, LuX } from "react-icons/lu";
import google from "../../../assets/images/icon/google.png";
import { useCreateAccount } from "../../../hooks/useAccount";

const SignUpPage = () => {
  const [values, setValues] = useState({
    maVaiTro: "VT000004",
    email: "",
    matKhau: "",
    confirmPassword: "",
    trangThai: "0",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showOTPForm, setShowOTPForm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  };

  const {
    mutateAsync: createAccount,
    isPending,
    isSuccess,
    isError,
    error,
  } = useCreateAccount({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const missingFields = Object.keys(values).filter(
      (key) => !values[key] || values[key].trim() === ""
    );

    if (missingFields.length > 0) {
      setFieldErrors({ form: "Vui lòng nhập đủ các trường" });
      return;
    }

    if (values.matKhau !== values.confirmPassword) {
      setFieldErrors({ confirmPassword: "Mật khẩu không khớp" });
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = values;
      console.log("Dữ liệu gửi lên API:", dataToSend);
      await createAccount(dataToSend);
      setShowOTPForm(true);
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Lỗi không xác định";
      console.log("Lỗi khi tạo tài khoản:", message);
    }
  };

  return (
    <div style={{ backgroundColor: "#F5FCFF", height: "100vh" }}>
      <ContentWrapper>
        <Grid
          templateColumns="repeat(3, 1fr)"
          w="70%"
          bg="#fff"
          style={{
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
          my="120px"
        >
          <GridItem>
            <Flex className="left-col" gap={5} px={4}>
              <p style={{ fontWeight: "600", fontSize: "30px" }}>
                Welcome Back!
              </p>
              <div>
                <button
                  onClick={() => navigate("/sign-in")}
                  className="signup-btn"
                >
                  Đăng nhập
                </button>
              </div>
            </Flex>
          </GridItem>

          <GridItem colSpan={2}>
            <Flex className="right-col" padding="24px" gap={8}>
              <p className="section-title">Đăng ký</p>

              <div className="signin-form" style={{ width: "70%" }}>
                <form onSubmit={handleSubmit}>
                  <Flex className="role-option" gap={6} justifyContent="center">
                    <label>
                      <input
                        type="radio"
                        name="maVaiTro"
                        value="VT000004"
                        checked={values.maVaiTro === "VT000004"}
                        onChange={handleChange}
                        style={{ marginRight: "6px" }}
                      />
                      Người tham gia
                    </label>
                    <br />
                    <label>
                      <input
                        type="radio"
                        name="maVaiTro"
                        value="VT000003"
                        checked={values.maVaiTro === "VT000003"}
                        onChange={handleChange}
                        style={{ marginRight: "6px" }}
                      />
                      Tổ chức sự kiện
                    </label>
                  </Flex>

                  <Flex flexDirection="column" gap={6}>
                    <InputGroup
                      startElement={
                        <Icon
                          as={LuMail}
                          style={{ fontSize: "16px", color: "#009fda" }}
                        />
                      }
                    >
                      <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </InputGroup>

                    <InputGroup
                      startElement={
                        <Icon
                          as={LuLock}
                          style={{ fontSize: "16px", color: "#009fda" }}
                        />
                      }
                    >
                      <input
                        name="matKhau"
                        placeholder="Mật khẩu"
                        type="password"
                        value={values.matKhau}
                        onChange={handleChange}
                      />
                    </InputGroup>

                    <InputGroup
                      startElement={
                        <Icon
                          as={LuLock}
                          style={{ fontSize: "16px", color: "#009fda" }}
                        />
                      }
                    >
                      <input
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                      />
                    </InputGroup>

                    {fieldErrors.email && (
                      <p style={{ color: "red" }}>{fieldErrors.email}</p>
                    )}
                    {fieldErrors.matKhau && (
                      <p style={{ color: "red" }}>{fieldErrors.matKhau}</p>
                    )}
                    {fieldErrors.confirmPassword && (
                      <p style={{ color: "red" }}>
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                    {fieldErrors.form && (
                      <p style={{ color: "red" }}>{fieldErrors.form}</p>
                    )}

                    <Flex justifyContent="center">
                      <Button
                        className="submit-btn"
                        type="submit"
                        isLoading={isPending}
                        disabled={
                          !values.email ||
                          !values.matKhau ||
                          !values.confirmPassword
                        }
                      >
                        Đăng ký
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              </div>

              <p>Hoặc</p>

              <Flex textAlign="center">
                <button
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    padding: "8px",
                  }}
                >
                  <img width="16px" src={google} alt="" />
                </button>
              </Flex>
            </Flex>
          </GridItem>
        </Grid>

        {showOTPForm && (
          <PopUp>
            <PopupContent>
              <div className="button-wrapper">
                <button onClick={() => setShowOTPForm(false)}>
                  <LuX />
                </button>
              </div>
              <OTPForm email={values.email} type="register" />
            </PopupContent>
          </PopUp>
        )}
      </ContentWrapper>
    </div>
  );
};

export default SignUpPage;
