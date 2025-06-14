import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutWrapper, ImageContainer, Avatar, NavLink } from "./style";
import { Flex, Box } from "@chakra-ui/react";
import { LuAlignJustify, LuUser, LuLogOut } from "react-icons/lu";
import firework from "../../../assets/images/firework.png";
import { useAuth } from "../../../hooks/useAccount";

const AdminLayout = ({ children }) => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const selectedKey = location.pathname.includes("account-manage")
    ? "account-manage"
    : location.pathname.split("/").pop();

  const options = [
    {
      key: "dashboard",
      icon: <LuUser />,
      label: "Thống kê",
    },
    {
      key: "account-manage",
      icon: <LuUser />,
      label: "Quản lý tài khoản ",
    },
    {
      key: "logout",
      icon: <LuLogOut />,
      label: "Đăng xuất",
    },
  ];

  const handleMenuItemClick = (key) => {
    if (key === "logout") {
      logout();
    } else {
      navigate(`/admin/${key}`);
    }
  };

  return (
    <div style={{ backgroundColor: "#F3F6F9", color: "#626461" }}>
      <LayoutWrapper className="container">
        <Flex className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <a
            href="#"
            style={{
              color: "#009CFF ",
              fontSize: "28px",
              fontWeight: "700",
              paddingLeft: "24px",
            }}
          >
            WELCOME
          </a>

          <Flex className="account-info">
            <ImageContainer>
              <Avatar src={firework} />
              <Box className="rounded-circle"></Box>
            </ImageContainer>
            <Flex flexDirection="column">
              <p
                className="staff-name"
                style={{ color: "#303030", fontWeight: "600" }}
              >
                Administrator
              </p>
              <p style={{ fontSize: "14px" }}>{userEmail}</p>
            </Flex>
          </Flex>

          <Flex className="account-nav">
            {options.map((option) => (
              <NavLink
                key={option.key}
                href={option.href}
                $selected={selectedKey === option.key}
                onClick={() => handleMenuItemClick(option.key)}
              >
                <Flex
                  className="nav-icon"
                  w="40px"
                  h="40px"
                  alignItems="center"
                  justifyContent="center"
                >
                  {option.icon}
                </Flex>
                {option.label}
              </NavLink>
            ))}
          </Flex>
        </Flex>

        <Box className={`content ${isSidebarOpen ? "expand" : ""}`}>
          <Flex className="navbar">
            <Flex className="sidebar-toggler">
              <a href="#" onClick={() => setIsSidebarOpen((prev) => !prev)}>
                <LuAlignJustify />
              </a>
            </Flex>

            <Box>
              <Flex gap="20px">
                <ImageContainer>
                  <Avatar src={firework} />
                </ImageContainer>
                <Flex flexDirection="column">
                  <p
                    className="staff-name"
                    style={{ color: "#303030", fontWeight: "600" }}
                  >
                    Administrator
                  </p>
                  <p style={{ fontSize: "14px" }}>{userEmail}</p>
                </Flex>
              </Flex>
            </Box>
          </Flex>

          <Box className="page-render" pb="200px">
            <div>{children}</div>
          </Box>
        </Box>
      </LayoutWrapper>
    </div>
  );
};

export default AdminLayout;
