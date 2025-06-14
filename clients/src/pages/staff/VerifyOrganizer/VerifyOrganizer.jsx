import { useParams, Link, useNavigate } from "react-router-dom";
import {
  StyledFlex,
  StatusWrapper,
  InfoWrapper,
  ImageContainer,
  StyleImage,
} from "../style";
import { Flex, Box, Grid, Button } from "@chakra-ui/react";
import { LuCircleChevronLeft, LuInfo, LuCreditCard } from "react-icons/lu";
import no_img from "../../../assets/images/no_img.png";
import {
  useOrganizerById,
  useUpdateOrgStatus,
} from "../../../hooks/useOrganizer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOrganizer = () => {
  const { orgId } = useParams();
  const { data: organizer, isLoading, error } = useOrganizerById(orgId);
  const navigate = useNavigate();
  const updateStatusMutation = useUpdateOrgStatus();

  const handleStatusChange = (status) => {
    updateStatusMutation.mutate(
      { id: orgId, status },
      {
        onSuccess: () => {
          toast.success(
            status === 1
              ? "Duyệt thông tin thành công!"
              : "Không duyệt thông tin tổ chức!",
            {
              position: "top-center",
              autoClose: 1500,
              onClose: () => navigate("/staff/list-organizer"),
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

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;

  if (!isLoading) {
    return (
      <StyledFlex gap={8}>
        <Flex flexDirection="column">
          <Link to="/staff/list-organizer" className="list-link">
            <Flex alignItems="center" gap={2}>
              <LuCircleChevronLeft />
              <p>Trở về danh sách</p>
            </Flex>
          </Link>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap={4}>
              <Flex className="title">
                <p> {organizer.tenCongTy}</p>
              </Flex>

              <StatusWrapper
                style={{
                  color:
                    organizer?.trangThaiDuyet === 0
                      ? "#ffbb54"
                      : organizer?.trangThaiDuyet === 1
                      ? "#43a047"
                      : "#626461",
                }}
              >
                {organizer?.trangThaiDuyet === 0 && "Chờ duyệt"}
                {organizer?.trangThaiDuyet === 1 && "Đã duyệt"}
                {organizer?.trangThaiDuyet === 2 && "Không duyệt"}
              </StatusWrapper>
            </Flex>

            <Flex justifyContent="flex-end">
              {organizer?.trangThaiDuyet === 0 && (
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

        <Flex className="detail-content" flexDirection="column" gap={6}>
          <InfoWrapper className="org-info">
            <Grid templateColumns="3fr 2fr" gap={12}>
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
                      Thông tin tài khoản
                    </p>
                  </Flex>

                  <Flex flexDirection="column" gap={4}>
                    <Flex flexDirection="column" gap={1}>
                      <ImageContainer w="100%" h="100%">
                        <StyleImage
                          src={
                            organizer?.anhDaiDien
                              ? organizer.anhDaiDien
                              : no_img
                          }
                          w="160px"
                        />
                      </ImageContainer>
                    </Flex>
                    <Flex flexDirection="column" gap={1}>
                      <p>Tên công ty / tổ chức</p>
                      <Box className="info-box">
                        <p>{organizer.tenCongTy}</p>
                      </Box>
                    </Flex>

                    <Flex flexDirection="column" gap={1}>
                      <p>Số điện thoại</p>
                      <Box className="info-box">
                        <p>{organizer.soDienThoai}</p>
                      </Box>
                    </Flex>

                    <Flex flexDirection="column" gap={1}>
                      <p>Email</p>
                      <Box className="info-box">
                        <p>{organizer.email}</p>
                      </Box>
                    </Flex>

                    <Flex flexDirection="column" gap={1}>
                      <p>Địa chỉ</p>
                      <Box className="info-box">
                        <p>
                          {organizer.diaChiCongTy} , {organizer.tenPhuongXa},{" "}
                          {organizer.tenQuanHuyen}, {organizer.tenTinhThanh}{" "}
                        </p>
                      </Box>
                    </Flex>
                  </Flex>
                </Box>

                <Box w="100%">
                  <Flex alignItems="center" gap={2} mb={8}>
                    <Box borderRadius="50%" bg="#E5F9D2" p={2}>
                      <LuCreditCard />
                    </Box>
                    <p
                      style={{
                        fontSize: "17px",
                        color: "#303030",
                        fontWeight: "600",
                      }}
                    >
                      Thông tin thanh toán
                    </p>
                  </Flex>
                  <Flex flexDirection="column" gap={4}>
                    <Grid templateColumns="1fr 1fr" gap={4}>
                      <Flex flexDirection="column" gap={1}>
                        <p>Chủ tài khoản thanh toán</p>
                        <Box className="info-box">
                          <p>{organizer.chuTaiKhoanThanhToan}</p>
                        </Box>
                      </Flex>

                      <Flex flexDirection="column" gap={1}>
                        <p>Số tài khoản</p>
                        <Box className="info-box">
                          <p>{organizer.soTaiKhoan}</p>
                        </Box>
                      </Flex>
                    </Grid>

                    <Grid templateColumns="1fr 1fr" gap={4}>
                      <Flex flexDirection="column" gap={1}>
                        <p>Ngân hàng</p>
                        <Box className="info-box">
                          <p>{organizer.tenNganHang}</p>
                        </Box>
                      </Flex>

                      <Flex flexDirection="column" gap={1}>
                        <p>Chi nhánh ngân hàng</p>
                        <Box className="info-box">
                          <p>{organizer.chiNhanhNganHang}</p>
                        </Box>
                      </Flex>
                    </Grid>
                  </Flex>
                </Box>
              </Flex>

              <Flex className="file-attached" flexDirection="column">
                <Box className="attached-file" h="100%">
                  {organizer?.giayPhepKinhDoanh && (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(
                        organizer.giayPhepKinhDoanh
                      )}&embedded=true`}
                      width="100%"
                      height="100%"
                    ></iframe>
                  )}
                </Box>
              </Flex>
            </Grid>
          </InfoWrapper>
        </Flex>
      </StyledFlex>
    );
  }
};

export default VerifyOrganizer;
