import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button, Box } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { OTPForm } from "../../../components/OTPForm/OTPForm";
import { ContentWrapper } from "../style";
import { LuKey, LuArrowLeft } from "react-icons/lu";
import {
  sendOTPToReset,
  resetPassword,
} from "../../../services/accountService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const res = await sendOTPToReset(email);
      if (!res.data.success) {
        setFieldErrors({ email: res.data.message });
        return;
      }

      setStep(2);
    } catch (error) {
      setFieldErrors({
        apiError:
          error.response?.data?.message || "Có lỗi hệ thống, vui lòng thử lại!",
      });
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!password || password.length < 8) {
      errors.password = "Mật khẩu phải có ít nhất 8 ký tự!";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await resetPassword(email, password);

      toast.success("Mật khẩu mới đã được cập nhật!", {
        position: "top-center",
        autoClose: 1000,
        onClose: () => navigate("/sign-in"),
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
      setFieldErrors({ apiError: "Lỗi khi cập nhật mật khẩu!" });
    }
  };

  return (
    <div style={{ backgroundColor: "#F5FCFF", height: "100vh" }}>
      <ContentWrapper justifyContent="center">
        <Box
          w="440px"
          bg="#fff"
          style={{
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          }}
          my="120px"
        >
          {step === 1 && (
            <Flex className="right-col" padding="24px" gap={8}>
              <Box borderRadius="50%" bg="#ebf3f6" p={4}>
                <LuKey style={{ color: "#009fda", fontSize: "24px" }} />
              </Box>

              <p style={{ fontSize: "24px" }}>Đặt lại mật khẩu</p>

              <form onSubmit={handleSubmitEmail} style={{ width: "80%" }}>
                <Flex flexDirection="column" gap={6}>
                  <Flex position="relative">
                    <InputGroup style={{ width: "100%" }}>
                      <input
                        placeholder="Nhập email của bạn"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>

                    {fieldErrors.email && (
                      <p
                        style={{
                          color: "#f3598f",
                          position: "absolute",
                          top: "100%",
                        }}
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </Flex>

                  <Flex justifyContent="center" mt={8}>
                    <Button
                      className="submit-btn"
                      type="submit"
                      disabled={!email}
                    >
                      Tiếp theo
                    </Button>
                  </Flex>
                </Flex>
              </form>

              <button onClick={() => navigate("/sign-in")}>
                <Flex alignItems="center">
                  <LuArrowLeft />
                  Trở lại trang đăng nhập
                </Flex>
              </button>
            </Flex>
          )}

          {step === 2 && (
            <Flex
              className="right-col"
              padding="24px"
              gap={8}
              style={{ position: "relative" }}
            >
              <button
                style={{ position: "absolute", top: "24px", left: "24px" }}
                onClick={() => setStep(1)}
              >
                <LuArrowLeft style={{ fontSize: "20px" }} />
              </button>
              <Box borderRadius="50%" bg="#ebf3f6" p={4}>
                <LuKey style={{ color: "#009fda", fontSize: "24px" }} />
              </Box>
              <OTPForm
                email={email}
                type="reset"
                onSuccess={() => setStep(3)}
              />
            </Flex>
          )}

          {step === 3 && (
            <Flex
              className="right-col"
              padding="24px"
              gap={8}
              style={{ position: "relative" }}
            >
              <Box borderRadius="50%" bg="#ebf3f6" p={4}>
                <LuKey style={{ color: "#009fda", fontSize: "24px" }} />
              </Box>

              <button
                style={{ position: "absolute", top: "24px", left: "24px" }}
                onClick={() => setStep(1)}
              >
                <LuArrowLeft style={{ fontSize: "20px" }} />
              </button>

              <p style={{ fontSize: "24px" }}>Thiết lập mật khẩu</p>

              <form onSubmit={handleSubmitPassword} style={{ width: "80%" }}>
                <Flex flexDirection="column" gap={6}>
                  <InputGroup>
                    <input
                      placeholder="Nhập mật khẩu mới"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>

                  {fieldErrors.password && (
                    <p style={{ color: "#de5c4c" }}>{fieldErrors.password}</p>
                  )}

                  <Flex justifyContent="center">
                    <Button
                      className="submit-btn"
                      type="submit"
                      disabled={!password}
                    >
                      Tiếp theo
                    </Button>
                  </Flex>
                </Flex>
              </form>
            </Flex>
          )}
        </Box>
      </ContentWrapper>
    </div>
  );
};

export default ResetPage;
