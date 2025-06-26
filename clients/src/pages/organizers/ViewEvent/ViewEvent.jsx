import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DetailWrapper, TotalWrapper } from "./style";
import { Flex, Box, Grid, GridItem, Button } from "@chakra-ui/react";
import { ComboBox } from "../../../components/ui/combobox";
import { LuCircleChevronLeft, LuX, LuCheck } from "react-icons/lu";
import { useEventById, useUpdateEvent } from "../../../hooks/useEvent";

const ViewEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { data: event, isLoading, error } = useEventById(eventId);

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
              <span>11.200.000đ</span>
            </Flex>

            <Flex flex="0 0 60%" gap={4}>
              <Flex className="box-item">
                <p>Tổng vé</p>
                <span>2000</span>
              </Flex>
              <Flex className="box-item">
                <p>Đã bán</p>
                <span>2000</span>
              </Flex>
              <Flex className="box-item">
                <p>Còn lại</p>
                <span>2000</span>
              </Flex>
            </Flex>
          </TotalWrapper>
        </Flex>
      </DetailWrapper>
    </div>
  );
};

export default ViewEvent;
