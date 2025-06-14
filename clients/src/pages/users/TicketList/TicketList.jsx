import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  TitleWrapper,
  TicketWrapper,
  ContentWrapper,
  ImageContainer,
  EventImage,
} from "./style";
import { Flex, Box } from "@chakra-ui/react";
import {
  LuTickets,
  LuCircleUserRound,
  LuCreditCard,
  LuMapPinned,
  LuTimer,
  LuChevronRight,
  LuCircleSlash2,
} from "react-icons/lu";
import { useOrderById } from "../../../hooks/useOrder";
import { useAuth } from "../../../hooks/useAccount";
import { useUserById } from "../../../hooks/useUser";

import concert_cd from "../../../assets/images/concert_cd.png";

const TicketList = ({}) => {
  const { accountId } = useAuth();
  const { orderId } = useParams();
  const { data: user } = useUserById(accountId);
  const { data: order } = useOrderById(orderId);

  const getStatus = (status) => {
    switch (status) {
      case 0:
        return "Chưa thanh toán";
      case 1:
        return "Hoàn thành";
      case 2:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
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
          <p>Vé đã mua</p>
        </TitleWrapper>

        <ContentWrapper className="content">
          <Flex className="order-detail" flexDirection="column" gap={4}>
            <Flex className="order-info" flexDirection="column">
              <Flex alignItems="center" gap={2}>
                <Box borderRadius="50%" bg="#FFF4CF" p={2}>
                  <LuTickets />
                </Box>
                <p>
                  Đơn hàng: <span>#{order?.maDonDatVe}</span>
                </p>
              </Flex>

              <Box className="table-container">
                <table className="main-table">
                  <thead>
                    <tr>
                      <th>Ngày đặt hàng</th>
                      <th>Ngày thanh toán</th>
                      <th>Phương thức thanh toán</th>
                      <th>Tình trạng đơn hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {new Date(order?.thoiGianDatVe).toLocaleString("vi-VN")}
                      </td>
                      <td>
                        {new Date(order?.thoiGianThanhToan).toLocaleString(
                          "vi-VN"
                        )}
                      </td>
                      <td>{order?.phuongThucThanhToan}</td>
                      <td>{getStatus(order?.trangThai)}</td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Flex>

            <Flex className="buyer-info" flexDirection="column">
              <Flex alignItems="center" gap={2}>
                <Box borderRadius="50%" bg="#E5F9D2" p={2}>
                  <LuCircleUserRound />
                </Box>
                <p>Thông tin người mua</p>
              </Flex>

              <Box className="table-container">
                <table className="main-table">
                  <tbody>
                    <tr>
                      <th style={{ width: "140px" }}>Tên</th>
                      <td>{user?.tenNguoiThamGia}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{user?.email}</td>
                    </tr>
                    <tr>
                      <th>Số điện thoại</th>
                      <td>{user?.soDienThoai}</td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Flex>

            <Flex className="order-total" flexDirection="column">
              <Flex alignItems="center" gap={2}>
                <Box borderRadius="50%" bg="#f9e1f9" p={2}>
                  <LuCreditCard />
                </Box>
                <p>Tổng tiền</p>
              </Flex>

              <Box className="table-container">
                <table className="main-table">
                  <thead>
                    <tr>
                      <th>Loại vé</th>
                      <th>Số lượng</th>
                      <th style={{ textAlign: "right" }}>Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.chiTietDatVe.map((ve) => (
                      <tr key={ve.maChiTietDatVe}>
                        <td>{ve.tenLoaiVe}</td>
                        <td>{ve.soLuongDat}</td>
                        <td style={{ textAlign: "right" }}>
                          {parseInt(ve.giaBan).toLocaleString()}đ
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3">
                        <Flex justifyContent="space-between">
                          <p>Tổng tiền:</p>
                          <p style={{ fontWeight: "600" }}>
                            {order?.chiTietDatVe
                              .reduce(
                                (total, ve) =>
                                  total + parseInt(ve.giaBan) * ve.soLuongDat,
                                0
                              )
                              .toLocaleString()}
                            đ{" "}
                          </p>
                        </Flex>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Box>
            </Flex>
          </Flex>

          <Box className="ticket-carouse">
            {order?.chiTietDatVe.map((lv) =>
              lv.veBan.map((ticket) => (
                <TicketWrapper key={ticket.maVe} alignItems="center">
                  <span></span>
                  <Flex flexDirection="column" w="100%" gap={2}>
                    <Flex>
                      <Flex flexDirection="column">
                        <p className="event-name">{order.tenSuKien}</p>

                        <ImageContainer
                          h="160px"
                          style={{
                            borderRadius: "10px",
                          }}
                        >
                          <EventImage src={order.anhBia} />
                        </ImageContainer>
                      </Flex>

                      <Flex className="ticket-info" gap={2}>
                        <Flex flexDirection="column">
                          <p>Số thứ tự</p>
                          <span>{ticket.viTri}</span>
                        </Flex>

                        <Flex flexDirection="column">
                          <p>Loại vé</p>
                          <span>{lv.tenLoaiVe}</span>
                        </Flex>

                        <Flex flexDirection="column">
                          <p>Thời gian</p>
                          <span>
                            {formatEventTime(
                              order?.thoiGianBatDau,
                              order?.thoiGianKetThuc
                            )}
                          </span>
                        </Flex>
                      </Flex>

                      <ImageContainer w="120px" h="120px" ml="auto">
                        <EventImage src={ticket.maQR} />
                      </ImageContainer>
                    </Flex>
                  </Flex>
                </TicketWrapper>
              ))
            )}
          </Box>
        </ContentWrapper>
      </Flex>
    </div>
  );
};

export default TicketList;
