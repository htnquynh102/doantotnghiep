import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  StyledFlex,
  StatusWrapper,
  InfoWrapper,
  ImageContainer,
  StyleImage,
  StatusBar,
  StatusButton,
} from "../style";
import { Flex, Box, Grid, GridItem, Button } from "@chakra-ui/react";
import { GenericTable } from "../../../components/ui/generic-table";
import {
  LuCircleChevronLeft,
  LuInfo,
  LuTickets,
  LuNewspaper,
  LuCalendarDays,
} from "react-icons/lu";
import { useEventById, useUpdateEventStatus } from "../../../hooks/useEvent";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyEvent = () => {
  const { eventId } = useParams();
  const { data: event, isLoading, error } = useEventById(eventId);
  const navigate = useNavigate();
  const updateStatusMutation = useUpdateEventStatus();
  const [activeTab, setActiveTab] = useState("Thông tin công ty");

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

    return (
      <span>
        <span style={{ color: "#007FBB" }}>
          {startHour}:{startMinute} {" - "} {endHour}:{endMinute}
        </span>

        <span></span>
        {` ngày ${day} tháng ${month} năm ${year}`}
      </span>
    );
  };

  const handleStatusChange = (status) => {
    updateStatusMutation.mutate(
      { id: eventId, status },
      {
        onSuccess: () => {
          toast.success(
            status === 1 ? "Duyệt sự kiện thành công!" : "Không duyệt sự kiện!",
            {
              position: "top-center",
              autoClose: 1500,
              onClose: () => navigate("/staff/list-event"),
            }
          );
        },
        onError: () => {
          toast.error("Lỗi khi cập nhật trạng thái!", {
            position: "top-center",
            autoClose: 1500,
          });
        },
      }
    );
  };

  if (isLoading) return <p>Đang tải dữ liệu sự kiện...</p>;
  if (error) return <p>Có lỗi xảy ra khi lấy dữ liệu sự kiện.</p>;

  if (!isLoading) {
    return (
      <StyledFlex gap={8}>
        <Flex flexDirection="column">
          <Link to="/staff/list-event" className="list-link">
            <Flex alignItems="center" gap={2}>
              <LuCircleChevronLeft />
              <p>Trở về danh sách</p>
            </Flex>
          </Link>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap={4}>
              <Flex className="title">
                <p> {event.tenSuKien}</p>
              </Flex>

              <StatusWrapper
                style={{
                  color:
                    event?.trangThaiDuyet === 0
                      ? "#ffbb54"
                      : event?.trangThaiDuyet === 1
                      ? "#43a047"
                      : "#626461",
                }}
              >
                {event?.trangThaiDuyet === 0 && "Chờ duyệt"}
                {event?.trangThaiDuyet === 1 && "Đã duyệt"}
                {event?.trangThaiDuyet === 2 && "Không duyệt"}
              </StatusWrapper>
            </Flex>

            <Flex justifyContent="flex-end">
              {event?.trangThaiDuyet === 0 && (
                <Flex gap={4}>
                  <Button
                    className="blue-btn"
                    onClick={() => handleStatusChange(1)}
                  >
                    Duyệt thông tin
                  </Button>

                  <Button
                    className="red-btn"
                    onClick={() => handleStatusChange(2)}
                  >
                    Không duyệt
                  </Button>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>

        <StatusBar>
          <StatusButton
            isActive={activeTab === "Thông tin công ty"}
            onClick={() => setActiveTab("Thông tin công ty")}
          >
            Thông tin sự kiện
          </StatusButton>

          <StatusButton
            isActive={activeTab === "Minh chứng"}
            onClick={() => setActiveTab("Minh chứng")}
          >
            Minh chứng
          </StatusButton>
        </StatusBar>

        {activeTab === "Thông tin công ty" && (
          <Flex className="detail-content" flexDirection="column" gap={6}>
            <InfoWrapper className="event-info">
              <Flex className="info-details" flexDirection="column" gap={12}>
                <Box w="100%">
                  <Flex alignItems="center" gap={2} mb={8}>
                    <Box borderRadius="50%" bg="#FFF4CF" p={2}>
                      <LuInfo />
                    </Box>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "#303030",
                        fontWeight: "600",
                      }}
                    >
                      Thông tin sự kiện
                    </p>
                  </Flex>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <ImageContainer>
                        <StyleImage src={event.anhBia} />
                      </ImageContainer>
                    </GridItem>

                    <GridItem>
                      <Flex flexDirection="column" gap={4}>
                        <Flex flexDirection="column" gap={1}>
                          <p>Tên sự kiện</p>
                          <Box className="info-box">
                            <p>{event.tenSuKien}</p>
                          </Box>
                        </Flex>
                        <Flex flexDirection="column" gap={1}>
                          <p>Loại sự kiện</p>
                          <Box className="info-box">
                            <p>{event.tenDanhMuc}</p>
                          </Box>
                        </Flex>
                        <Flex flexDirection="column" gap={1}>
                          <p>Địa điểm</p>
                          <Box className="info-box">
                            <p>
                              {event.diaDiemToChuc}, {event.soNhaDuong},{" "}
                              {event.tenPhuongXa}, {event.tenQuanHuyen},{" "}
                              {event.tenTinhThanh}
                            </p>
                          </Box>
                        </Flex>
                        <Flex flexDirection="column" gap={1}>
                          <p>Công ty tổ chức</p>
                          <Box className="info-box">
                            <p>{event.tenCongTy}</p>
                          </Box>
                        </Flex>
                      </Flex>
                    </GridItem>
                  </Grid>
                </Box>

                <Box w="100%">
                  <Flex alignItems="center" gap={2} mb={8}>
                    <Box borderRadius="50%" bg="#E5F9D2" p={2}>
                      <LuTickets />
                    </Box>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "#303030",
                        fontWeight: "600",
                      }}
                    >
                      Thông tin vé
                    </p>
                  </Flex>

                  <Flex flexDirection="column" gap={4}>
                    <Flex flexDirection="column" gap={1}>
                      <p className="sub-title">Thời gian bán vé</p>
                      <Box className="info-box">
                        <p>
                          {new Date(event.thoiGianMoBanVe).toLocaleString(
                            "vi-VN"
                          )}
                          {" - "}
                          {new Date(event.thoiGianNgungBanVe).toLocaleString(
                            "vi-VN"
                          )}
                        </p>
                      </Box>
                    </Flex>
                    <Flex flexDirection="column" gap={1}>
                      <p className="sub-title">Tổng số vé bán</p>
                      <Box className="info-box">
                        <p>
                          {event.chuongtrinh
                            .flatMap((ct) => ct.loaiVe)
                            .reduce((acc, ve) => acc + ve.soLuong, 0)}
                        </p>
                      </Box>
                    </Flex>
                    <Flex flexDirection="column" gap={1}>
                      <p className="sub-title">
                        Quy định tối đa số lượng vé được mua
                      </p>
                      <Box className="info-box">
                        <p>{event.soVeMuaToiDa}</p>
                      </Box>
                    </Flex>

                    <Flex flexDirection="column" gap={1}>
                      <p className="sub-title">Bảng vé</p>
                      {event.chuongtrinh.map((program, index) => {
                        const ticketColumns = [
                          { header: "Loại vé", accessor: "tenLoaiVe" },
                          { header: "Số lượng bán", accessor: "soLuong" },
                          {
                            header: "Giá vé",
                            accessor: (row) =>
                              `${row.giaBan.toLocaleString()}đ`,
                          },
                        ];

                        return (
                          <Box key={index}>
                            <Box className="program-time">
                              <Flex
                                p="12px"
                                alignItems="center"
                                gap={4}
                                style={{ fontWeight: "600" }}
                              >
                                <LuCalendarDays />
                                <p>
                                  {formatEventTime(
                                    program.thoiGianBatDau,
                                    program.thoiGianKetThuc
                                  )}
                                </p>
                              </Flex>
                            </Box>
                            <GenericTable
                              columns={ticketColumns}
                              data={program.loaiVe}
                              headerColor="#626461"
                              fontWeight="500"
                            />
                          </Box>
                        );
                      })}
                    </Flex>
                  </Flex>
                </Box>

                <Flex flexDirection="column">
                  <Flex alignItems="center" gap={2} mb={8}>
                    <Box borderRadius="50%" bg="#fdeafb" p={2}>
                      <LuNewspaper />
                    </Box>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "#303030",
                        fontWeight: "600",
                      }}
                    >
                      Giới thiệu sự kiện
                    </p>
                  </Flex>{" "}
                  <Box
                    className="info-box"
                    h="200px"
                    dangerouslySetInnerHTML={{ __html: event.moTa }}
                  ></Box>
                </Flex>
              </Flex>
            </InfoWrapper>
          </Flex>
        )}

        {activeTab === "Minh chứng" && (
          <Flex
            className="file-attached"
            flexDirection="column"
            width="80%"
            height="100vh"
          >
            {event?.minhChung && event.minhChung.length > 0 ? (
              <Box className="attached-file" h="100%">
                {event.minhChung.map((file, index) => (
                  <iframe
                    key={index}
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      file.tepDinhKem
                    )}&embedded=true`}
                    width="80%"
                    height="100%"
                    style={{ marginBottom: "15px" }}
                  ></iframe>
                ))}
              </Box>
            ) : (
              <p style={{ color: "#626461", fontStyle: "italic" }}>
                Chưa cung cấp minh chứng
              </p>
            )}
          </Flex>
        )}
      </StyledFlex>
    );
  }
};

export default VerifyEvent;
