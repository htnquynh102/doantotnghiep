import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import { Flex, Button, Box } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { TitleWrapper, ContentWrapper } from "./style";
import {
  LuShieldAlert,
  LuShieldCheck,
  LuKey,
  LuBadgeCheck,
  LuArrowLeft,
} from "react-icons/lu";
import { resetPassword } from "../../../services/accountService";
import { useAuth } from "../../../hooks/useAccount";
import { useOrganizerById } from "../../../hooks/useOrganizer";

const ChangePassword = () => {
  const { accountId } = useAuth();
  const { data: org } = useOrganizerById(accountId);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        setStep(3);
      }, 3000);
    }
  }, [step]);

  const handleVerifyPassword = async (e) => {
    e.preventDefault();

    try {
      const storedPasswordHash = org.matKhau;

      const isMatch = await bcrypt.compare(password, storedPasswordHash);
      if (!isMatch) {
        setFieldErrors({ password: "Mật khẩu hiện tại không đúng!" });
        return;
      }

      setStep(2);
    } catch (error) {
      console.error("Lỗi khi kiểm tra mật khẩu:", error);
      setFieldErrors({ apiError: "Không thể xác minh tài khoản!" });
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!newPassword || newPassword.length < 8) {
      errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự!";
    }

    if (newPassword !== newPasswordConfirm) {
      errors.confirmPassword = "Mật khẩu nhập lại không khớp!";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await resetPassword(org.email, newPassword);
      setStep(4);
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
      setFieldErrors({ apiError: "Lỗi khi cập nhật mật khẩu!" });
    }
  };

  return (
    <div>
      <Flex flexDirection="column" gap={8}>
        <TitleWrapper className="title">
          <p>Đổi mật khẩu</p>
        </TitleWrapper>

        <ContentWrapper justifyContent="center">
          <Box
            w="600px"
            bg="#fff"
            style={{
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
            }}
          >
            {step === 1 && (
              <Flex className="right-col" padding="24px 24px 60px" gap={8}>
                <Box borderRadius="50%" bg="#ebf3f6" p={4}>
                  <LuShieldAlert
                    style={{ color: "#009fda", fontSize: "40px" }}
                  />
                </Box>

                <p style={{ fontSize: "24px" }}>Xác minh tài khoản</p>

                <form onSubmit={handleVerifyPassword} style={{ width: "80%" }}>
                  <Flex flexDirection="column" gap={6}>
                    <Flex style={{ position: "relative" }}>
                      <InputGroup style={{ width: "100%" }}>
                        <input
                          placeholder="Nhập mật khẩu hiện tại"
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </InputGroup>

                      {fieldErrors.password && (
                        <p
                          style={{
                            color: "#f3598f",
                            position: "absolute",
                            top: "100%",
                          }}
                        >
                          {fieldErrors.password}
                        </p>
                      )}
                    </Flex>

                    <Flex justifyContent="center" mt={12}>
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

            {step === 2 && (
              <Flex className="right-col" padding="24px 24px 60px" gap={8}>
                <Box borderRadius="50%" bg="#ebf3f6" p={4}>
                  <LuShieldCheck
                    style={{ color: "#009fda", fontSize: "40px" }}
                  />
                </Box>

                <p style={{ fontSize: "24px" }}>Thành công!</p>

                <p>Chúc mừng bạn đã hoàn thành việc xác minh tài khoản</p>
              </Flex>
            )}

            {step === 3 && (
              <Flex
                className="right-col"
                padding="24px 24px 60px"
                gap={8}
                style={{ position: "relative" }}
              >
                <Box borderRadius="50%" bg="#ebf3f6" p={4}>
                  <LuKey style={{ color: "#009fda", fontSize: "40px" }} />
                </Box>

                <button
                  style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                  }}
                  onClick={() => setStep(1)}
                >
                  <LuArrowLeft style={{ fontSize: "20px" }} />
                </button>

                <p style={{ fontSize: "24px" }}>Thiết lập mật khẩu</p>

                <form
                  onSubmit={handleSubmitNewPassword}
                  style={{ width: "80%" }}
                >
                  <Flex flexDirection="column" gap={6}>
                    <Flex flexDirection="column" position="relative">
                      <Flex flexDirection="column" gap={2}>
                        <label htmlFor="new-password">Mật khẩu mới</label>
                        <InputGroup>
                          <input
                            id="new-password"
                            type="password"
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </InputGroup>
                      </Flex>

                      <Flex flexDirection="column" gap={2}>
                        <label htmlFor="confirm-password">
                          Xác nhận mật khẩu
                        </label>
                        <InputGroup>
                          <input
                            id="confirm-password"
                            type="password"
                            onChange={(e) =>
                              setNewPasswordConfirm(e.target.value)
                            }
                          />
                        </InputGroup>
                      </Flex>

                      {(fieldErrors.newPassword ||
                        fieldErrors.confirmPassword) && (
                        <Box color="#f3598f" position="absolute" top="100%">
                          {fieldErrors.newPassword && (
                            <p>{fieldErrors.newPassword}</p>
                          )}
                          {fieldErrors.confirmPassword && (
                            <p>{fieldErrors.confirmPassword}</p>
                          )}
                        </Box>
                      )}
                    </Flex>

                    <Flex justifyContent="center" mt={12}>
                      <Button
                        className="submit-btn"
                        type="submit"
                        disabled={!password}
                      >
                        Xác nhận
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              </Flex>
            )}

            {step === 4 && (
              <Flex className="right-col" padding="24px 24px 60px" gap={8}>
                <Box borderRadius="50%" bg="#ebf3f6" p={4}>
                  <LuBadgeCheck
                    style={{ color: "#009fda", fontSize: "40px" }}
                  />
                </Box>

                <p style={{ fontSize: "24px" }}>Thành công!</p>

                <p>Chúc mừng! Bạn đã thay đổi mật khẩu thành công</p>
              </Flex>
            )}
          </Box>
        </ContentWrapper>
      </Flex>
    </div>
  );
};

export default ChangePassword;
