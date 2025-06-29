import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutWrapper,
  ImageContainer,
  Avatar,
  NavLink,
  PopUp,
  PopupContent,
  NotifyWrapper,
} from "./style";
import { Flex, Box, Button } from "@chakra-ui/react";
import {
  LuAlignJustify,
  LuLayoutDashboard,
  LuKeySquare,
  LuFilePen,
  LuTickets,
  LuCalendarPlus2,
  LuLogOut,
  LuBellRing,
  LuCheckCheck,
} from "react-icons/lu";
import no_img from "../../../assets/images/no_img.png";
import information from "../../../assets/images/information.png";
import { useAuth } from "../../../hooks/useAccount";
import { useOrganizerById } from "../../../hooks/useOrganizer";
import {
  useNotificationByUser,
  useMarkNotificationAsRead,
} from "../../../hooks/useNotification";

const OrganizerLayout = ({ children }) => {
  const { userEmail, accountId, logout } = useAuth();
  const { data: org, isLoading, isError, error } = useOrganizerById(accountId);
  const { data: notify } = useNotificationByUser(accountId);
  const { mutateAsync: markAsRead } = useMarkNotificationAsRead();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const notifyRef = useRef(null);
  const location = useLocation();
  const selectedKey = location.pathname.includes("my-events")
    ? "my-events"
    : location.pathname.split("/").pop();

  const options = [
    {
      key: "dashboard",
      icon: <LuLayoutDashboard />,
      label: "Thống kê",
    },
    {
      key: "profile",
      icon: <LuFilePen />,
      label: "Cập nhật hồ sơ",
    },
    {
      key: "password",
      icon: <LuKeySquare />,
      label: "Đổi mật khẩu",
    },
    {
      key: "my-events",
      icon: <LuTickets />,
      label: "Sự kiện của tôi",
    },
    {
      key: "create-event",
      icon: <LuCalendarPlus2 />,
      label: "Tạo sự kiện",
    },
    {
      key: "logout",
      icon: <LuLogOut />,
      label: "Đăng xuất",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setIsNotifyOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!org) return;

    const status = org?.trangThaiDuyet;

    if (status === null || status === 0 || status === 2) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [org]);

  const handleMenuItemClick = (key) => {
    if (key === "logout") {
      logout();
    } else if (key === "create-event") {
      if (org?.trangThaiDuyet === 1) {
        navigate(`/organizer/create-event`);
      } else {
        setShowForm(true);
      }
    } else {
      navigate(`/organizer/${key}`);
    }
  };

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {error.message}</p>;
  if (!org && !isLoading) {
    return null;
  }

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
              <Avatar src={org?.anhDaiDien || no_img} />
              <Box className="rounded-circle"></Box>
            </ImageContainer>
            <Flex flexDirection="column">
              <p
                className="organizer-name"
                style={{ color: "#303030", fontWeight: "600" }}
              >
                {org?.tenCongTy || "Tên công ty"}
              </p>
              <p>Tổ chức sự kiện</p>
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
              <Flex gap="20px" align="center">
                <NotifyWrapper style={{ position: "relative" }}>
                  <Flex
                    className="notify-btn"
                    onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                  >
                    <LuBellRing style={{ color: "#009fda" }} />
                  </Flex>

                  {isNotifyOpen && (
                    <Flex className="notify-box" direction="column">
                      <Flex
                        justifyContent="space-between"
                        style={{ padding: "16px 16px 0 16px" }}
                      >
                        <p className="title">Thông báo</p>

                        <Flex
                          align="center"
                          gap={1}
                          color="#00567E"
                          onClick={() => markAsRead({ id: accountId })}
                          cursor="pointer"
                        >
                          <LuCheckCheck />
                          <p>Đã đọc tất cả</p>
                        </Flex>
                      </Flex>

                      <Flex
                        className="notify-list"
                        direction="column"
                        overflowY="auto"
                      >
                        {notify?.length > 0 ? (
                          notify.map((item) => (
                            <Flex
                              key={item.maThongBao}
                              py="16px"
                              align="center"
                              justifyContent="space-between"
                            >
                              <Flex direction="column" w="86%">
                                <p>
                                  <span className="label">{item.tieuDe}: </span>
                                  {item.noiDung}
                                </p>

                                <p style={{ fontSize: "12px", color: "#888" }}>
                                  {new Date(item.thoiGianGui).toLocaleString(
                                    "vi-VN"
                                  )}
                                </p>
                              </Flex>

                              {item.daDoc === 0 && (
                                <Box
                                  w="8px"
                                  h="8px"
                                  borderRadius="full"
                                  bg="red.500"
                                  display="inline-block"
                                />
                              )}
                            </Flex>
                          ))
                        ) : (
                          <p>Không có thông báo nào.</p>
                        )}
                      </Flex>
                    </Flex>
                  )}
                </NotifyWrapper>

                <ImageContainer>
                  <Avatar src={org?.anhDaiDien || no_img} />
                </ImageContainer>

                <Flex flexDirection="column">
                  <p
                    className="organizer-name"
                    style={{ color: "#303030", fontWeight: "600" }}
                  >
                    Danke Media
                  </p>
                  <p>{userEmail}</p>
                </Flex>
              </Flex>
            </Box>
          </Flex>

          <Box className="page-render" pb="200px">
            <div>{children}</div>
          </Box>
        </Box>
      </LayoutWrapper>

      {showForm && (
        <PopUp>
          <PopupContent style={{ width: "500px" }}>
            <img src={information} alt="" />
            {org?.trangThaiDuyet === null && (
              <>
                <p style={{ textTransform: "uppercase", fontWeight: "600" }}>
                  Hoàn thiện hồ sơ của bạn để tiếp tục
                </p>
                <p>
                  Để đảm bảo trải nghiệm tốt nhất và giúp bạn tổ chức sự kiện dễ
                  dàng hơn, vui lòng cung cấp đầy đủ thông tin cần thiết.
                </p>
              </>
            )}

            {org?.trangThaiDuyet === 0 && (
              <>
                <p style={{ textTransform: "uppercase", fontWeight: "600" }}>
                  Hồ sơ đang chờ xét duyệt
                </p>
                <p>
                  Cảm ơn bạn đã hoàn thiện hồ sơ. Hệ thống sẽ thông báo kết quả
                  trong thời gian sớm nhất. Vui lòng kiên nhẫn.
                </p>
              </>
            )}

            {org?.trangThaiDuyet === 2 && (
              <>
                <p style={{ textTransform: "uppercase", fontWeight: "600" }}>
                  Hồ sơ chưa được duyệt
                </p>
                <p>
                  Hồ sơ của bạn chưa hợp lệ hoặc còn thiếu. Vui lòng cập nhật
                  lại để được duyệt và tiếp tục sử dụng tính năng.
                </p>
              </>
            )}

            <Flex gap="10px" mt="20px" justifyContent="center">
              <Button
                onClick={() => {
                  setShowForm(false);
                  navigate("/organizer/profile");
                }}
                className="blue-btn"
              >
                OK
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  navigate("/organizer/dashboard");
                }}
                className="gray-btn"
              >
                Để sau{" "}
              </Button>
            </Flex>
          </PopupContent>
        </PopUp>
      )}
    </div>
  );
};

export default OrganizerLayout;
