import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Image } from "@chakra-ui/react";
import fire from "../../assets/images/icon/fire.png";
import {
  LuArrowLeft,
  LuArrowRight,
  LuMapPin,
  LuTicket,
  LuTimer,
} from "react-icons/lu";
import { useLatestEvents } from "../../hooks/useEvent";
import {
  WrapperEvent,
  ParentDiv,
  ChildDiv,
  ImageContainer,
  EventImage,
  ContentContainer,
  NavButton,
} from "./style";

function CarouseComponent({ padding = "8.5em max(1em, 10vw)" }) {
  const navigate = useNavigate();
  const parentRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 1;
  const scrollAmount = useRef(0);

  const { data: latestEvents = [], isLoading, error } = useLatestEvents();

  const parentDivs = [];

  for (let i = 0; i < latestEvents.length; i += 2) {
    parentDivs.push({
      id: `parent-${i}`,
      children: latestEvents.slice(i, i + 2).map((event, index) => ({
        id: `child-${i}-${index}`,
        content: (
          <div>
            <ImageContainer className="image-container">
              <EventImage src={event.anhBia} />
            </ImageContainer>
            <ContentContainer className="content-container">
              <span>{event.tenSuKien}</span>
              <Flex
                flexDirection="column"
                style={{ borderLeft: "1px solid", paddingLeft: "12px" }}
              >
                <Flex gap={4} alignItems="flex-start">
                  <LuTimer />
                  <p>
                    {new Date(event.thoiGianBatDau).toLocaleString("vi-VN")}
                  </p>
                </Flex>
                <Flex gap={4} alignItems="flex-start">
                  <LuMapPin />
                  <p>
                    {event.diaDiemToChuc}, {event.soNhaDuong},{" "}
                    {event.tenPhuongXa}, {event.tenQuanHuyen},{" "}
                    {event.tenTinhThanh}
                  </p>
                </Flex>
                <Flex gap={4} alignItems="flex-start">
                  <LuTicket />
                  <p>
                    {event.giaBanThapNhat
                      ? Number(event.giaBanThapNhat).toLocaleString("vi-VN") +
                        "đ"
                      : ""}
                  </p>
                </Flex>
              </Flex>
              <div>
                <button
                  onClick={() => navigate(`/eventDetail/${event.maSuKien}`)}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#FFCCEA",
                    borderRadius: "20px",
                    marginTop: "40px",
                    fontWeight: "600",
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            </ContentContainer>
          </div>
        ),
      })),
    });
  }

  const totalItems = parentDivs.length;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollAmount.current -= parentRef.current.offsetWidth;
      parentRef.current.scrollTo({
        left: scrollAmount.current,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalItems - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
      scrollAmount.current += parentRef.current.offsetWidth;
      parentRef.current.scrollTo({
        left: scrollAmount.current,
        behavior: "smooth",
      });
    }
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= totalItems - itemsPerPage;

  if (isLoading) return <p>Đang tải sự kiện...</p>;
  if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu sự kiện.</p>;

  return (
    <div
      style={{
        padding,
        background:
          "radial-gradient(50% 50% at 50% 100%, var(--token-9316698b-f2ef-4a1e-8616-6a3a01368917, #bfecff) 0%, rgb(255, 255, 255) 80.18018018018019%)",
      }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        style={{ marginBottom: "40px" }}
      >
        <Flex gap={6}>
          <Flex alignItems="center">
            <Image src={fire} height="32px" />
          </Flex>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#00567E",
              width: "100%",
            }}
          >
            Sự kiện mới nhất
          </p>
        </Flex>

        <Flex mt={4} gap={4}>
          <NavButton
            onClick={handlePrev}
            isDisabled={isFirst}
            bg={isFirst ? "#cdcdcd" : "#009FDA"}
          >
            <LuArrowLeft />
          </NavButton>
          <NavButton
            onClick={handleNext}
            isDisabled={isLast}
            bg={isLast ? "#cdcdcd" : "#009FDA"}
          >
            <LuArrowRight />
          </NavButton>
        </Flex>
      </Flex>

      <Flex direction="column" align="center">
        <WrapperEvent ref={parentRef}>
          {parentDivs.map((parent, parentIndex) => (
            <ParentDiv key={parent.id}>
              {parent.children.map((child) => (
                <ChildDiv key={child.id}>{child.content}</ChildDiv>
              ))}
            </ParentDiv>
          ))}
        </WrapperEvent>
      </Flex>
    </div>
  );
}

export default CarouseComponent;
