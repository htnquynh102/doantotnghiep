import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../utils/axios";
import {
  EventBackground,
  OrderDetailWrapper,
  TicketCard,
  TicketTable,
  UserWrapper,
  PopUp,
  PopupContent,
  ImageContainer,
  EventImage,
} from "./style";
import { Button, Box, Flex, Grid, Em } from "@chakra-ui/react";
import {
  LuArrowLeft,
  LuTimer,
  LuMapPinned,
  LuTickets,
  LuPlus,
  LuOctagonAlert,
} from "react-icons/lu";
import { NumberInput } from "../../../components/ui/number-input";
import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import CountdownTimer from "../../../components/CountdownTimer/CountdownTimer";

import concert_cd from "../../../assets/images/concert_cd.png";
import { useEventById } from "../../../hooks/useEvent";
import {
  usePlaceOrder,
  useOrderByUser,
  useUpdateTicketOrder,
  useUpdateOrderCanceled,
} from "../../../hooks/useOrder";
import { useCreatePayment } from "../../../hooks/usePayment";
import { useAuth } from "../../../hooks/useAccount";
import { useUserById } from "../../../hooks/useUser";

const OrderPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const step = Number(searchParams.get("step")) || 1;
  const { accountId } = useAuth();
  const { data: user } = useUserById(accountId);
  const { eventId, programId } = useParams();
  const { data: event, isLoading, error } = useEventById(eventId);
  const { mutateAsync: placeOrder } = usePlaceOrder();
  const { mutateAsync: updateTicket } = useUpdateTicketOrder();
  const { mutateAsync: createPayment } = useCreatePayment();
  const { mutateAsync: updateOrderCanceled } = useUpdateOrderCanceled();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [expiredAt, setExpiredAt] = useState(null);

  const program = event?.chuongtrinh.find(
    (ct) => ct.maChuongTrinh === programId
  );
  const [quantities, setQuantities] = useState({});
  const [existingOrder, setExistingOrder] = useState(null);
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
  const { data: orders } = useOrderByUser(user?.maNguoiThamGia);
  const latestOrder = orders?.find((order) => order.trangThai === 0);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    if (!searchParams.has("step")) {
      setSearchParams({ step: 1 });
    }
  }, []);

  const handleNextStep = () => {
    setSearchParams({ step: 2 });
  };

  const handlePreviousStep = () => {
    setSearchParams({ step: 1 });
    setExistingOrder(latestOrder);
  };

  const handleQuantityChange = (maLoaiVe, newQuantity) => {
    setQuantities((prev) => ({
      ...prev,
      [maLoaiVe]: newQuantity,
    }));
  };

  const selectedTickets = program?.loaiVe.filter(
    (ve) => quantities[ve.maLoaiVe] > 0
  );

  const totalPrice = selectedTickets?.reduce(
    (sum, ve) => sum + quantities[ve.maLoaiVe] * parseInt(ve.giaBan, 10),
    0
  );

  const totalSelectedTickets = selectedTickets?.reduce(
    (sum, ve) => sum + quantities[ve.maLoaiVe],
    0
  );

  const orderData = {
    maNguoiThamGia: user?.maNguoiThamGia,
    chiTietDatVe: selectedTickets?.map((ve) => ({
      maLoaiVe: ve.maLoaiVe,
      soLuongDat: quantities[ve.maLoaiVe],
    })),
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!orderData.chiTietDatVe || !Array.isArray(orderData.chiTietDatVe)) {
      alert("Dữ liệu vé không hợp lệ!");
      return;
    }

    try {
      let maDonDatVe = null;

      if (existingOrder) {
        await updateTicket({
          orderId: latestOrder.maDonDatVe,
          ticketData: orderData.chiTietDatVe,
        });

        maDonDatVe = latestOrder.maDonDatVe;
      } else {
        const res = await placeOrder(orderData);
        maDonDatVe = res.maDonDatVe;
      }

      const paymentRes = await createPayment({
        maDonDatVe,
        tongTien: totalPrice,
      });
      console.log("Payment Response:", paymentRes);

      if (paymentRes?.qrCode) {
        setQrCode(paymentRes.qrCode);
      } else {
        console.warn("Không có mã QR trong response!");
      }

      if (paymentRes?.expiredAt) {
        setExpiredAt(paymentRes.expiredAt * 1000);
      }

      setCurrentOrderId(maDonDatVe);

      handleNextStep();
    } catch (error) {
      alert("Đã xảy ra lỗi khi đặt vé!");
      console.error(error);
    }
  };

  const handleOrderTimeout = async () => {
    if (!latestOrder) return;

    try {
      await updateOrderCanceled({ orderId: latestOrder.maDonDatVe });
      console.log("Đơn đặt vé đã hết hạn! Cập nhật trạng thái trong DB.");
      setShowTimeoutPopup(true);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  useEffect(() => {
    if (!currentOrderId) return;

    console.log(currentOrderId ? currentOrderId : "noid");
    const interval = setInterval(async () => {
      const { data } = await axiosInstance.get(
        `/order/get-order-by-id/${currentOrderId}`
      );
      if (data.data.trangThai === 1) {
        clearInterval(interval);
        navigate(`/order-result/${currentOrderId}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentOrderId]);

  useEffect(() => {
    if (totalSelectedTickets === event.soVeMuaToiDa) {
      alert("OK");
    }
  });

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

      <Flex
        justifyContent="space-between"
        paddingInline="max(1em, 10vw)"
        my="48px"
        gap={12}
      >
        <Flex justifyContent="center">
          <Button
            onClick={() => {
              if (step === 1) navigate(`/eventDetail/${eventId}`);
            }}
            isDisabled={step !== 1}
            style={{ backgroundColor: "transparent", color: "#656667" }}
          >
            <LuArrowLeft />
            Quay lại
          </Button>
        </Flex>

        <Flex flexDirection="column" gap={4} w="100%">
          <EventBackground gap={8} backgroundImage={`url(${concert_cd})`}>
            <Flex direction="column">
              <p className="event-name">{event?.tenSuKien}</p>
              <Flex className="event-info" gap={1}>
                <Flex gap={2} alignItems="center">
                  <LuTimer className="icon" />
                  <p>
                    {formatEventTime(
                      program?.thoiGianBatDau,
                      program?.thoiGianKetThuc
                    )}
                  </p>
                </Flex>

                <Flex gap={2} alignItems="center">
                  <LuMapPinned className="icon" />
                  <p>
                    {event?.diaDiemToChuc}
                    {", "}
                    {event?.soNhaDuong}
                    {", "}
                    {event?.tenPhuongXa}
                    {", "}
                    {event?.tenQuanHuyen}
                    {", "}
                    {event?.tenTinhThanh}
                  </p>
                </Flex>
              </Flex>
            </Flex>
            {expiredAt && (
              <div style={{ zIndex: "2" }}>
                <CountdownTimer
                  seconds={Math.max(
                    0,
                    Math.floor((expiredAt - Date.now()) / 1000)
                  )}
                  onExpire={handleOrderTimeout}
                />
              </div>
            )}
          </EventBackground>

          <Grid templateColumns="2fr 1fr" mt="24px" gap={8}>
            <Box className="main-content">
              {step === 1 ? (
                <Flex flexDirection="column">
                  <Flex alignItems="center" gap={2} px="12px">
                    <Box borderRadius="50%" bg="#ffc6d1" p={2}>
                      <LuOctagonAlert />
                    </Box>

                    <Em>
                      Lưu ý: Chỉ được chọn tối đa{" "}
                      <span style={{ fontWeight: "600" }}>
                        {event?.soVeMuaToiDa}
                      </span>{" "}
                      trong một lần đặt{" "}
                    </Em>
                  </Flex>

                  <TicketTable>
                    {program?.loaiVe.map((ve, index) => (
                      <Flex
                        className="ticket-row"
                        alignItems="center"
                        justifyContent="space-between"
                        key={ve.maLoaiVe || index}
                      >
                        <Flex flexDirection="column">
                          <p>{ve.tenLoaiVe}</p>
                          <p style={{ color: "#009FDA", fontWeight: "600" }}>
                            {parseInt(ve.giaBan, 10).toLocaleString("vi-VN")}đ
                          </p>
                        </Flex>

                        <NumberInput
                          value={quantities[ve.maLoaiVe] || 0}
                          onChange={(val) =>
                            handleQuantityChange(ve.maLoaiVe, val)
                          }
                          min={0}
                          max={Math.min(
                            event?.soVeMuaToiDa,
                            parseInt(ve.soLuongConLai, 10)
                          )}
                          totalSelectedTickets={totalSelectedTickets}
                          maxEventTickets={event?.soVeMuaToiDa}
                        />
                      </Flex>
                    ))}
                  </TicketTable>
                </Flex>
              ) : (
                <Flex>
                  <Flex flex="1" alignItems="center" direction="column">
                    <Flex direction="column" mb={12}>
                      <p style={{ color: "#656667", fontSize: "13px" }}>
                        Tổng tiền phải thanh toán
                      </p>
                      <span
                        style={{
                          color: "#FF9C9C",
                          fontSize: "32px",
                          fontWeight: "600",
                        }}
                      >
                        {" "}
                        {totalPrice?.toLocaleString("vi-VN")}đ
                      </span>
                    </Flex>
                    <Box p={4} style={{ backgroundColor: "#F7F7F5" }}>
                      <ImageContainer w="220px" h="220px">
                        {qrCode ? (
                          <EventImage
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                              qrCode
                            )}`}
                          />
                        ) : (
                          <p>Đang tạo mã QR...</p>
                        )}
                      </ImageContainer>
                    </Box>
                  </Flex>
                </Flex>
              )}
            </Box>

            <Flex direction="column" gap={4}>
              <UserWrapper flex="1">
                <p className="title">Thông tin người mua</p>

                <Flex className="user-info" direction="column" gap={2}>
                  <Flex justify="space-between">
                    <p>Họ tên</p>
                    <span>như quỳnh</span>
                  </Flex>

                  <Flex justify="space-between">
                    <p>Số điện thoại</p>
                    <span>0767517057</span>
                  </Flex>

                  <Flex justify="space-between">
                    <p>Email</p>
                    <span>baobinh31012001@gmail.com</span>
                  </Flex>
                </Flex>
              </UserWrapper>

              <OrderDetailWrapper gap={4}>
                <Flex
                  className="selected-tickets"
                  gap={4}
                  style={{ minHeight: "100%" }}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <p style={{ fontSize: "14px" }}>Total:</p>
                    <p className="total">
                      {totalPrice?.toLocaleString("vi-VN")}đ
                    </p>
                  </Flex>

                  <Flex alignItems="center" gap={2}>
                    <Box borderRadius="50%" bg="#FFF4CF" p={2}>
                      <LuTickets />
                    </Box>
                    <p>Vé đã chọn</p>
                  </Flex>

                  <Flex flexDirection="column" gap={4}>
                    {selectedTickets?.length === 0 ? (
                      <p
                        style={{
                          fontStyle: "italic",
                          color: "#888",
                          fontSize: "13px",
                        }}
                      >
                        Chưa có vé nào
                      </p>
                    ) : (
                      selectedTickets?.map((ve) => (
                        <TicketCard key={ve.maLoaiVe} p={5}>
                          <Flex flexDirection="column">
                            <p className="ticket-name">{ve.tenLoaiVe}</p>
                            <p className="ticket-number">
                              Số lượng: <span>{quantities[ve.maLoaiVe]}</span>
                            </p>
                          </Flex>

                          <p>
                            {(
                              quantities[ve.maLoaiVe] * parseInt(ve.giaBan, 10)
                            ).toLocaleString("vi-VN")}
                            đ
                          </p>
                        </TicketCard>
                      ))
                    )}
                  </Flex>

                  {step === 2 && (
                    <Flex
                      alignItems="center"
                      gap={2}
                      style={{ cursor: "pointer" }}
                      onClick={handlePreviousStep}
                    >
                      <Box borderRadius="50%" bg="#E5F9D2" p={2}>
                        <LuPlus />
                      </Box>
                      <p>Chọn lại vé</p>
                    </Flex>
                  )}
                </Flex>

                {step === 1 && selectedTickets?.length > 0 && (
                  <Button
                    className="blue-btn"
                    h="48px"
                    onClick={handlePlaceOrder}
                  >
                    Đặt vé ngay với {totalPrice?.toLocaleString("vi-VN")}đ
                  </Button>
                )}
              </OrderDetailWrapper>
            </Flex>
          </Grid>
        </Flex>
      </Flex>

      {showConfirm && (
        <PopUp>
          <PopupContent>
            <>
              <p>Đặt vé thành công</p>
              <Flex gap="10px" mt="20px" justifyContent="center">
                <Button onClick={() => navigate(`/`)} className="blue-btn">
                  Về trang chủ
                </Button>
                <Button
                  onClick={() => navigate(`/user/joined-events`)}
                  className="red-btn"
                >
                  Xem đơn
                </Button>
              </Flex>
            </>
          </PopupContent>
        </PopUp>
      )}

      {showTimeoutPopup && (
        <PopUp>
          <PopupContent>
            <>
              <p>Đã hết thời gian thanh toán</p>
              <Flex gap="10px" mt="20px" justifyContent="center">
                <Button
                  onClick={() => navigate(`/order/${eventId}/${programId}`)}
                  className="blue-btn"
                >
                  Đặt lại
                </Button>

                <Button
                  onClick={() => navigate(`/eventDetail/${eventId}`)}
                  className="red-btn"
                >
                  Hủy
                </Button>
              </Flex>
            </>
          </PopupContent>
        </PopUp>
      )}
    </div>
  );
};

export default OrderPage;
