import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DetailWrapper,
  TotalWrapper,
  TicketContainer,
  CustomerContainer,
} from "./style";
import { Flex, Box, Grid, GridItem, Button } from "@chakra-ui/react";
import { GenericTable } from "../../../components/ui/generic-table";
import { LuCircleChevronLeft, LuX, LuCheck } from "react-icons/lu";
import { useEventById } from "../../../hooks/useEvent";
import { useOrderByEvent } from "../../../hooks/useOrder";

const ViewEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data: order } = useOrderByEvent(eventId);
  const { data: event, isLoading, error } = useEventById(eventId);
  const eventActivities = event?.chuongtrinh || [];

  console.log(order);

  const stats = event?.chuongtrinh?.reduce(
    (acc, ct) => {
      ct.loaiVe?.forEach((ve) => {
        const soLuong = parseInt(ve.soLuong, 10) || 0;
        const soConLai = parseInt(ve.soLuongConLai, 10) || 0;
        const daBan = soLuong - soConLai;

        acc.tongVe += soLuong;
        acc.daBan += daBan;
        acc.conLai += soConLai;
      });
      return acc;
    },
    { tongVe: 0, daBan: 0, conLai: 0 }
  );

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

  const columns = [
    { header: "Tài khoản", accessor: "email" },
    { header: "Tên", accessor: "tenNguoiThamGia" },
    { header: "SĐT", accessor: "soDienThoai" },
    {
      header: "Đã đặt",
      accessor: (row) => (
        <Flex direction="column" gap={1}>
          {row.chiTietDatVe?.map((ve, idx) => (
            <span key={idx}>
              {ve.tenLoaiVe}: {ve.soLuongDat}
            </span>
          ))}
        </Flex>
      ),
    },
    { header: "Số điện thoại", accessor: "soDienThoai" },
    { header: "Tổng tiền", accessor: "tongTien" },
    {
      header: "Thời gian thanh toán",
      accessor: (row) => {
        const date = new Date(row.thoiGianThanhToan);
        return date.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
  ];

  if (isLoading) return <p>Đang tải dữ liệu sự kiện...</p>;
  if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu sự kiện.</p>;

  return (
    <div>
      <DetailWrapper gap={8}>
        <Box className="title">
          <p>Tình trạng bán vé</p>
        </Box>

        <Flex className="view-content">
          <a href="" className="events-link">
            <Flex
              alignItems="center"
              gap={2}
              onClick={() => navigate(`/organizer/my-events`)}
            >
              <LuCircleChevronLeft />
              <p>Danh sách sự kiện</p>
            </Flex>
          </a>

          <Flex flexDirection="column" gap="32px">
            <Flex className="event-info">
              <Flex alignItems="center">
                <p
                  className="event-name"
                  style={{ textTransform: "uppercase", fontSize: "20px" }}
                >
                  {event.tenSuKien}
                </p>
                <p className="event-status">Đã kết thúc</p>
              </Flex>

              <p className="event-addr">
                {event.diaDiemToChuc}
                {", "}
                {event.soNhaDuong ? formData.soNhaDuong : ""}
                {", "}
                {event.tenPhuongXa} {event.tenQuanhuyen}
                {", "}
                {event.tenTinhThanh}
              </p>
            </Flex>
          </Flex>

          <TotalWrapper justify="space-between" mt="40px">
            <Flex direction="column" className="total" flex="0 0 40%">
              <p>Doanh thu</p>
              <span>
                {event?.tongDoanhThu
                  ? Number(event.tongDoanhThu).toLocaleString("vi-VN") + "đ"
                  : "0đ"}
              </span>
            </Flex>

            <Flex flex="0 0 60%" gap={4}>
              <Flex className="box-item">
                <p>Tổng vé</p>
                <span>{stats.tongVe}</span>
              </Flex>
              <Flex className="box-item">
                <p>Đã bán</p>
                <span>{stats.daBan}</span>
              </Flex>
              <Flex className="box-item">
                <p>Còn lại</p>
                <span>{stats.conLai}</span>
              </Flex>
            </Flex>
          </TotalWrapper>

          <TicketContainer mt="40px">
            <p>Bảng vé</p>

            <div className="ticket-table">
              {eventActivities.map((activity, index) => (
                <div className="event-time" key={index}>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    style={{
                      padding: "16px 0",
                    }}
                    onClick={() => handleChildClick(index)}
                  >
                    <span
                      style={{
                        color: "#a1a1a1",
                        textTransform: "uppercase",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      {formatEventTime(
                        eventActivities[index].thoiGianBatDau,
                        eventActivities[index].thoiGianKetThuc
                      )}
                    </span>
                  </Flex>

                  <div>
                    {activity.loaiVe.map((ticket, idx) => (
                      <Flex key={idx} className="event-type">
                        <Flex direction="column" flex="1">
                          <p>{ticket.tenLoaiVe}</p>

                          <p style={{ color: "#009FDA" }}>
                            {parseInt(ticket.giaBan, 10).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </p>
                        </Flex>

                        <Flex flex="1" gap={6} className="ticket-stats">
                          <Flex gap={1} style={{ backgroundColor: "#fee2d7" }}>
                            <p>Số lượng</p>
                            <span>{ticket.soLuong}</span>
                          </Flex>
                          <Flex gap={1} style={{ backgroundColor: "#eccdff" }}>
                            <p>Đã bán</p>
                            <span>{ticket.soLuong - ticket.soLuongConLai}</span>
                          </Flex>
                          <Flex gap={1} style={{ backgroundColor: "#e3def4" }}>
                            <p>Còn lại</p>
                            <span>{ticket.soLuongConLai}</span>
                          </Flex>
                        </Flex>

                        <Flex gap={1} flex="1" justify="flex-end">
                          <p>Tỷ lệ</p>
                          <span>
                            {ticket.soLuong > 0
                              ? Math.round(
                                  ((ticket.soLuong - ticket.soLuongConLai) /
                                    ticket.soLuong) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </Flex>
                      </Flex>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TicketContainer>

          <CustomerContainer mt="40px">
            <p
              style={{
                color: "#a1a1a1",
                textTransform: "uppercase",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Danh sách khác hàng
            </p>

            <Box
              style={{ border: "1px solid #ccc", borderRadius: "10px" }}
              p="12px"
            >
              <GenericTable columns={columns} data={order} />
            </Box>
          </CustomerContainer>
        </Flex>
      </DetailWrapper>
    </div>
  );
};

export default ViewEvent;
