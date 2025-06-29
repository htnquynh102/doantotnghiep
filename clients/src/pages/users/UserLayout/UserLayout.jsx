import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  StyledFlex,
  ContentWrapper,
  ImageContainer,
  EventImage,
} from "./style";
import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../../components/FooterComponent/FooterComponent";
import { Box, Text, Grid, VStack, Button } from "@chakra-ui/react";
import {
  LuChevronRight,
  LuUser,
  LuKeySquare,
  LuTickets,
  LuLogOut,
} from "react-icons/lu";
import rabbit from "../../../assets/images/rabbit.png";
import { useAuth } from "../../../hooks/useAccount";
import { useUserById } from "../../../hooks/useUser";

const UserLayout = ({ children }) => {
  const { accountId, logout } = useAuth();
  const { data: user, isLoading, isError, error } = useUserById(accountId);
  const location = useLocation();
  const selectedKey = location.pathname.includes("joined-events")
    ? "joined-events"
    : location.pathname.split("/").pop();

  const options = [
    {
      key: "profile",
      icon: <LuUser />,
      label: "Thông tin tài khoản",
    },
    {
      key: "password",
      icon: <LuKeySquare />,
      label: "Đổi mật khẩu",
    },
    {
      key: "joined-events",
      icon: <LuTickets />,
      label: "Tham gia sự kiện",
    },
    {
      key: "logout",
      icon: <LuLogOut />,
      label: "Đăng xuất",
    },
  ];

  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (user?.anhDaiDien) {
      setPreview(user.anhDaiDien);
    } else {
      setPreview(rabbit);
    }
  }, [user?.anhDaiDien]);

  const navigate = useNavigate();
  const handleMenuItemClick = (key) => {
    if (key === "logout") {
      logout();
    } else {
      navigate(`/user/${key}`);
    }
  };
  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;

  return (
    <div
      style={{
        paddingTop: "80px",
        background:
          "linear-gradient(0deg, #ffffff 10%, rgb(191, 236, 255) 100%)",
        backgroundSize: `100% 200px`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <HeaderComponent />
      <ContentWrapper
        className="content-wrap"
        flexDirection="column"
        gap={10}
        py="3.5em"
        paddingInline="max(1em, 10vw)"
      >
        <div className="title-section">
          <StyledFlex className="breadcrumb" justifyContent="flex-start">
            <Link to="/">
              <Text>Trang chủ</Text>
            </Link>
            <LuChevronRight />
            <Text>Thông tin tài khoản</Text>
          </StyledFlex>
        </div>

        <div className="main-section">
          <Grid templateColumns="25% 75%">
            <Box className="left-col">
              <StyledFlex className="avatar" flexDirection="column" gap={4}>
                <ImageContainer>
                  <EventImage src={preview} />
                </ImageContainer>
                <p style={{ color: "#009FDA", fontWeight: "600" }}>
                  {user.email}
                </p>
              </StyledFlex>
              <VStack className="account-nav" align="stretch" spacing={0}>
                {options.map((option) => (
                  <Button
                    key={option.key}
                    onClick={() => handleMenuItemClick(option.key)}
                    bg={selectedKey === option.key ? "#dcf4ff" : "#fff"}
                    fontWeight={selectedKey === option.key ? "bold" : "normal"}
                    color={selectedKey === option.key ? "#009FDA" : "#626461"}
                    variant="ghost"
                    p="12px 24px"
                  >
                    {option.icon}
                    {option.label}
                  </Button>
                ))}
              </VStack>
            </Box>
            <Box className="right-col">
              <div className="page-render">{children}</div>
            </Box>
          </Grid>
        </div>
      </ContentWrapper>

      <FooterComponent />
    </div>
  );
};

export default UserLayout;
