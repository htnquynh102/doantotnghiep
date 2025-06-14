import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Button, Grid, GridItem, Icon } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { ContentWrapper } from "../style";
import google from "../../../assets/images/icon/google.png";
import { LuMail, LuLock } from "react-icons/lu";
import { useAuth } from "../../../hooks/useAccount";

const SignInPage = () => {
  const { handleLogin, loading, error, isAuthenticated } = useAuth();
  const [values, setValues] = useState({
    email: "",
    matKhau: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await handleLogin(values.email, values.matKhau);

    if (!result || result?.error) {
      return;
    }

    const userRole = result.account.maVaiTro;

    console.log("Role sau khi đăng nhập:", userRole); // Kiểm tra role

    if (userRole === "VT000001") navigate("/admin/dashboard");
    else if (userRole === "VT000002") navigate("/staff/list-organizer");
    else if (userRole === "VT000003") navigate("/organizer/dashboard");
    else navigate("/");
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
                Chào mừng bạn!
              </p>
              <p>
                Hãy nhập thông tin của bạn và khám phá những sự kiện hấp dẫn
                cùng chúng tôi.
              </p>
              <div>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="signup-btn"
                >
                  Tạo tài khoản
                </button>
              </div>
            </Flex>
          </GridItem>

          <GridItem colSpan={2}>
            <Flex className="right-col" padding="24px" gap={8}>
              <p className="section-title">Đăng nhập</p>

              <form
                className="signin-form"
                style={{ width: "70%" }}
                onSubmit={handleSubmit}
              >
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
                      placeholder="Email"
                      type="email"
                      onChange={(e) =>
                        setValues({ ...values, email: e.target.value })
                      }
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
                      placeholder="Mật khẩu"
                      type="password"
                      onChange={(e) =>
                        setValues({ ...values, matKhau: e.target.value })
                      }
                    />
                  </InputGroup>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <Flex justifyContent="center">
                    <button
                      onClick={(event) => {
                        event.preventDefault();
                        navigate("/reset");
                      }}
                      style={{ color: "#F3598F" }}
                    >
                      Quên mật khẩu?
                    </button>
                  </Flex>

                  <Flex justifyContent="center">
                    <Button
                      className="submit-btn"
                      type="submit"
                      disabled={!values.email || !values.matKhau}
                    >
                      Đăng nhập
                    </Button>
                  </Flex>
                </Flex>
              </form>

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
      </ContentWrapper>
    </div>
  );
};

export default SignInPage;
