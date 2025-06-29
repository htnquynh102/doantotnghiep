import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TitleWrapper,
  ButtonWrapper,
  OrderInformation,
  EventCard,
  StatusWrapper,
  ImageContainer,
  EventImage,
} from "./style";
import { Flex, Box, Grid, Text, Table } from "@chakra-ui/react";
import {
  LuMapPinned,
  LuTimer,
  LuChevronRight,
  LuCircleSlash2,
} from "react-icons/lu";
import { useOrderByUser } from "../../../hooks/useOrder";
import { useAuth } from "../../../hooks/useAccount";
import { useUserById } from "../../../hooks/useUser";

const UserEvent = ({}) => {
  const navigate = useNavigate();
  const { accountId } = useAuth();
  const { data: user } = useUserById(accountId);
  const { data: orders } = useOrderByUser(user.maNguoiThamGia);

  console.log(orders);
  const filters = [
    { label: "Tất cả", value: "all" },
    { label: "Hoàn thành", value: "1" },
    { label: "Đã hủy", value: "2" },
  ];
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = orders?.filter((order) => {
    if (filterStatus === "all") return true;
    return order?.trangThai === parseInt(filterStatus);
  });

  const getEventStatus = (start, end) => {
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);

    if (now < startTime) return { label: "Sắp diễn ra", color: "yellow" };
    if (now > endTime) return { label: "Đã diễn ra", color: "green" };
    return { label: "Đang diễn ra", color: "red" };
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

  return (
    <div>
      <Flex flexDirection="column" gap="32px">
        <TitleWrapper className="title">
          <p>Tham gia sự kiện</p>
        </TitleWrapper>

        <Box className="content">
          <ButtonWrapper>
            {filters.map(({ label, value }) => {
              const isActive = filterStatus === value;

              return (
                <button
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  style={
                    isActive
                      ? { color: "#009fda", border: "1px solid #009fda" }
                      : {}
                  }
                >
                  {label}
                </button>
              );
            })}
          </ButtonWrapper>

          <Flex className="events-wrapper" flexDirection="column" gap="20px">
            {filteredOrders?.length === 0 ? (
              <Flex justifyContent="center" p={8}>
                <p style={{ fontStyle: "italic", color: "#616161" }}>
                  Không có đơn nào
                </p>
              </Flex>
            ) : (
              filteredOrders?.map((order) => {
                const { label, color } = getEventStatus(
                  order.thoiGianBatDau,
                  order.thoiGianKetThuc
                );

                return (
                  <Flex
                    key={order?.maDonDatVe}
                    flexDirection="column"
                    style={{
                      border: "1px solid #ededed",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <OrderInformation>
                      <Flex gap={12}>
                        <Flex flexDirection="column" gap={1}>
                          <p className="label">Đặt vé</p>
                          <p>
                            {new Date(order?.thoiGianDatVe).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </Flex>

                        <Flex flexDirection="column" gap={1}>
                          <p className="label">Thanh toán</p>
                          {order?.thoiGianThanhToan ? (
                            <p>
                              {new Date(
                                order?.thoiGianThanhToan
                              ).toLocaleString("vi-VN")}
                            </p>
                          ) : (
                            <LuCircleSlash2
                              style={{ fontSize: "14px", color: "#616161" }}
                            />
                          )}
                        </Flex>

                        <Flex flexDirection="column" gap={1}>
                          <p className="label">Tổng tiền</p>
                          <p>{order?.tongTien.toLocaleString("vi-VN") + "đ"}</p>
                        </Flex>
                      </Flex>

                      <p>
                        Mã đơn #<span>{order.maDonDatVe}</span>
                      </p>
                    </OrderInformation>

                    <EventCard>
                      <Flex>
                        <StatusWrapper className={color}>
                          <span>{label}</span>
                        </StatusWrapper>
                      </Flex>

                      <Grid templateColumns="1fr 3fr" h="120px">
                        <Box>
                          <ImageContainer>
                            <EventImage src={order?.anhBia} />
                          </ImageContainer>
                        </Box>

                        <Flex className="event-container" gap={8}>
                          <Flex className="event-info">
                            <p className="event-name">{order?.tenSuKien}</p>

                            <Flex gap={2} alignItems="center">
                              <LuTimer className="icon" />
                              <Text>
                                {formatEventTime(
                                  order?.thoiGianBatDau,
                                  order?.thoiGianKetThuc
                                )}
                              </Text>
                            </Flex>

                            <Flex gap={2} alignItems="flex-start">
                              <LuMapPinned className="icon" />
                              <Text>
                                {order?.diaDiemToChuc}
                                {", "}
                                {order?.soNhaDuong}
                                {", "}
                                {order?.tenPhuongXa}
                                {", "}
                                {order?.tenQuanHuyen}
                                {", "}
                                {order?.tenTinhThanh}
                              </Text>
                            </Flex>
                          </Flex>

                          <button
                            className="view-tickets-btn"
                            onClick={() =>
                              navigate(
                                `/user/joined-events/${order.maDonDatVe}/list-ticket`
                              )
                            }
                          >
                            <LuChevronRight style={{ fontSize: "24px" }} />
                          </button>
                        </Flex>
                      </Grid>
                    </EventCard>
                  </Flex>
                );
              })
            )}
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default UserEvent;
