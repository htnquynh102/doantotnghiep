import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ContentWrapper,
  InfoContainer,
  ImageContainer,
  EventImage,
  IntroductionContainer,
  TicketContainer,
  PopUp,
  PopupContent,
} from "./style";
import CarouseComponent from "../../../components/CarouseComponent/CarouseComponent";
import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../../components/FooterComponent/FooterComponent";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import {
  LuChevronRight,
  LuMapPinned,
  LuTicket,
  LuTimer,
  LuChevronDown,
  LuChevronUp,
  LuCircleChevronDown,
  LuCircleArrowUp,
} from "react-icons/lu";
import { motion } from "framer-motion";
import { useEventById } from "../../../hooks/useEvent";
import { useAuth } from "../../../hooks/useAccount";

const EventDetail = () => {
  const { isAuthenticated } = useAuth();
  const { eventId } = useParams();
  const { data: event, isLoading, error } = useEventById(eventId);
  const eventActivities = event?.chuongtrinh || [];
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expandedChild, setExpandedChild] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const ticketRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setIsOverflowing(contentHeight > 500);
    }
  }, [event?.moTa]);

  const toggleExpandDescription = () => {
    if (expandedDescription && containerRef.current) {
      window.scrollTo({
        top: containerRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }

    setExpandedDescription(!expandedDescription);
  };

  const scrollToTickets = () => {
    if (ticketRef.current) {
      const offset = 100;
      const top =
        ticketRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleChildClick = (childIndex) => {
    setExpandedChild((prevExpanded) =>
      prevExpanded === childIndex ? null : childIndex
    );
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const formatEventTime = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const startHour = startDate.getHours().toString().padStart(2, "0");
    const startMinute = startDate.getMinutes().toString().padStart(2, "0");
    const endHour = endDate.getHours().toString().padStart(2, "0");
    const endMinute = endDate.getMinutes().toString().padStart(2, "0");

    const day = startDate.getDate().toString().padStart(2, "0");
    const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const year = startDate.getFullYear();

    return `${startHour}:${startMinute} - ${endHour}:${endMinute} ngày ${day} tháng ${month} năm ${year}`;
  };

  const getLowestPrice = (event) => {
    const allPrices = event.chuongtrinh.flatMap((program) =>
      program.loaiVe.map((ticket) => parseInt(ticket.giaBan, 10))
    );

    const lowestPrice = Math.min(...allPrices);

    return lowestPrice.toLocaleString("vi-VN") + "đ";
  };

  const getEventStatus = (event) => {
    if (!event.chuongtrinh || event.chuongtrinh.length === 0)
      return "Chưa có lịch trình";

    const now = new Date();
    const firstProgramStart = new Date(event.chuongtrinh[0].thoiGianBatDau);
    const lastProgramEnd = new Date(
      event.chuongtrinh[event.chuongtrinh.length - 1].thoiGianKetThuc
    );

    if (now < firstProgramStart) {
      return "Sắp diễn ra";
    } else if (now > lastProgramEnd) {
      return "Đã diễn ra";
    } else {
      return "Đang diễn ra";
    }
  };

  const isPlaceOrderAvailable = () => {
    const now = new Date();
    const start = new Date(event.thoiGianMoBanVe);
    const end = new Date(event.thoiGianNgungBanVe);

    return now >= start && now <= end;
  };

  const collapseVariants = {
    open: { opacity: 1, height: "auto" },
    closed: { opacity: 0, height: 0 },
  };

  if (isLoading) return <p>Đang tải dữ liệu sự kiện...</p>;
  if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu sự kiện.</p>;

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
        py="7.5em"
        paddingInline="max(1em, 10vw)"
      >
        <div className="title-section">
          <Flex
            alignItems="center"
            className="breadcrumb"
            justifyContent="flex-start"
          >
            <Text>Trang chủ</Text>
            <LuChevronRight />
            <Text>
              <Link to="/">{event?.tenDanhMuc}</Link>
            </Text>
            <LuChevronRight />
            <Text
              style={{
                textTransform: "uppercase",
                color: "#00567E",
                fontWeight: "600",
              }}
            >
              {event?.tenSuKien}
            </Text>
          </Flex>
        </div>

        <InfoContainer className="information-section" gap={12}>
          <Flex className="event-info" w="100%" mb={4}>
            <Box
              className="event-detail"
              w="50%"
              borderRight="1px solid #656667"
              pr={16}
            >
              <Flex direction="column" gap={4}>
                <Flex className="event-schedule" direction="column">
                  <Flex gap={2} alignItems="center">
                    <LuTimer className="icon" />
                    <Text>
                      {formatEventTime(
                        eventActivities[0]?.thoiGianBatDau,
                        eventActivities[0]?.thoiGianKetThuc
                      )}
                    </Text>
                  </Flex>
                  {eventActivities.length > 1 && (
                    <Flex
                      cursor="pointer"
                      onClick={handleToggle}
                      fontSize="sm"
                      color="#009FDA"
                      ml={8}
                      alignItems="center"
                      gap={1}
                    >
                      {isOpen ? (
                        <>
                          Ẩn {eventActivities.length - 1} đêm khác
                          <LuChevronUp />
                        </>
                      ) : (
                        <>
                          + {eventActivities.length - 1} đêm khác
                          <LuChevronDown />
                        </>
                      )}
                    </Flex>
                  )}

                  <motion.div
                    variants={collapseVariants}
                    animate={isOpen ? "open" : "closed"}
                    style={{ overflow: "hidden" }}
                  >
                    <Flex direction="column" ml={8} mt={2} gap={2}>
                      {eventActivities.slice(1).map((activity, index) => (
                        <Flex key={index} gap={2} alignItems="center">
                          <p>
                            {formatEventTime(
                              activity.thoiGianBatDau,
                              activity.thoiGianKetThuc
                            )}
                          </p>
                        </Flex>
                      ))}
                    </Flex>
                  </motion.div>
                </Flex>

                <Flex className="event-address" gap={2} alignItems="flex-start">
                  <LuMapPinned className="icon" />
                  <Text>
                    {event.diaDiemToChuc}
                    {", "}
                    {event.soNhaDuong}
                    {", "}
                    {event.tenPhuongXa}
                    {", "}
                    {event.tenQuanHuyen}
                    {", "}
                    {event.tenTinhThanh}
                  </Text>
                </Flex>
                <Flex className="event-price" gap={2} alignItems="center">
                  <LuTicket className="icon" />
                  <Text>{getLowestPrice(event)}</Text>
                </Flex>
                <Flex>
                  <button
                    disabled={!isPlaceOrderAvailable()}
                    onClick={scrollToTickets}
                    style={{
                      cursor: isPlaceOrderAvailable()
                        ? "pointer"
                        : "not-allowed",
                      opacity: isPlaceOrderAvailable() ? 1 : 0.5,
                    }}
                  >
                    Đặt vé ngay
                  </button>
                </Flex>
              </Flex>
            </Box>
            <Box className="event-name" w="50%" pl={16}>
              <Flex justifyContent="space-between">
                <Box
                  w="fit-content"
                  py={1}
                  px={3}
                  style={{
                    backgroundColor: "#ffccea",
                    fontSize: "11px",
                    borderRadius: "28px",
                  }}
                >
                  <p>{getEventStatus(event)}</p>
                </Box>
                <p>
                  Tổ chức bởi
                  <span style={{ fontWeight: "600", marginLeft: "8px" }}>
                    {event.tenCongTy}
                  </span>
                </p>
              </Flex>
              <p
                style={{
                  color: "#009FDA",
                  fontSize: "32px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  margin: "12px 0",
                }}
              >
                {event.tenSuKien}
              </p>
            </Box>
          </Flex>
          <Box className="event-img" w="100%" textAlign="center">
            <ImageContainer className="image-container">
              <EventImage src={event.anhBia} />
            </ImageContainer>
          </Box>
        </InfoContainer>

        <IntroductionContainer ref={containerRef} flexDirection="column">
          <p className="section-title">Thông tin giới thiệu</p>
          <div
            ref={contentRef}
            style={{
              overflow: "hidden",
              maxHeight: expandedDescription ? "none" : "500px",
              transition: "max-height 0.3s ease-in-out",
            }}
            dangerouslySetInnerHTML={{ __html: event.moTa }}
          />
          {isOverflowing && (
            <Button onClick={toggleExpandDescription} mt={2} variant="link">
              {expandedDescription ? (
                <LuCircleArrowUp />
              ) : (
                <LuCircleChevronDown />
              )}
              {expandedDescription ? "Thu gọn" : "Xem thêm"}
            </Button>
          )}
        </IntroductionContainer>

        <TicketContainer className="ticket-section" ref={ticketRef}>
          <p className="section-title">Thông tin vé</p>

          <div className="ticket-table">
            {eventActivities.map((activity, index) => (
              <div className="event-time" key={index}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid #e2e2e2",
                  }}
                  onClick={() => handleChildClick(index)}
                >
                  <p>
                    <span style={{ color: "#F3598F" }}>
                      {formatEventTime(
                        eventActivities[index].thoiGianBatDau,
                        eventActivities[index].thoiGianKetThuc
                      )}
                    </span>
                  </p>
                  <button
                    disabled={!isPlaceOrderAvailable()}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAuthenticated) {
                        setShowPopup(true);
                        return;
                      }
                      navigate(`/order/${eventId}/${activity.maChuongTrinh}`);
                    }}
                    style={{
                      cursor: isPlaceOrderAvailable()
                        ? "pointer"
                        : "not-allowed",
                      opacity: isPlaceOrderAvailable() ? 1 : 0.5,
                    }}
                  >
                    Đặt vé
                  </button>
                </Flex>

                {expandedChild === index && (
                  <motion.div
                    className="event-type-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    {activity.loaiVe.map((ticket, idx) => (
                      <Flex
                        key={idx}
                        className="event-type"
                        justifyContent="space-between"
                        style={{
                          padding: "12px 16px",
                          backgroundColor: idx % 2 === 0 ? "#E1ECF1" : "#fff",
                          borderBottom: "1px solid #e2e2e2",
                        }}
                      >
                        <p>{ticket.tenLoaiVe}</p>
                        {ticket.soLuongConLai === 0 ? (
                          <p style={{ color: "red", fontWeight: "bold" }}>
                            Đã bán hết
                          </p>
                        ) : (
                          <p style={{ color: "#009FDA" }}>
                            {parseInt(ticket.giaBan, 10).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </p>
                        )}
                      </Flex>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </TicketContainer>

        <CarouseComponent padding="8.5em max(1em, 0)" />
      </ContentWrapper>
      <FooterComponent />

      {showPopup && (
        <PopUp>
          <PopupContent style={{ width: "500px" }}>
            <p style={{ textTransform: "uppercase", fontWeight: "600" }}>
              Hãy đăng nhập để tiếp tục!
            </p>

            <Flex gap="10px" mt="20px" justifyContent="center">
              <Button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/sign-in");
                }}
                className="blue-btn"
              >
                Đồng ý
              </Button>
              <Button
                onClick={() => {
                  setShowPopup(false);
                }}
                className="gray-btn"
              >
                Để sau
              </Button>
            </Flex>
          </PopupContent>
        </PopUp>
      )}
    </div>
  );
};

export default EventDetail;
