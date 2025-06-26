import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  EventBackground,
  OrderDetailWrapper,
  TicketCard,
  TicketTable,
  PopUp,
  PopupContent,
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
import concert_cd from "../../../assets/images/concert_cd.png";
import { useEventById } from "../../../hooks/useEvent";
import {
  usePlaceOrder,
  useOrderByUser,
  useUpdateTicketOrder,
  useUpdateOrderCompleted,
  useUpdateOrderCanceled,
} from "../../../hooks/useOrder";
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
  const { mutateAsync: updateOrderCompleted } = useUpdateOrderCompleted();
  const { mutateAsync: updateOrderCanceled } = useUpdateOrderCanceled();
  const [showConfirm, setShowConfirm] = useState(false);

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

  // --------Step 1----------------------

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

  const updatedOrderData = {
    ...orderData,
    thoiGianThanhToan: new Date().toISOString().slice(0, 19).replace("T", " "),
    phuongThucThanhToan: "Tín dụng",
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!orderData.chiTietDatVe || !Array.isArray(orderData.chiTietDatVe)) {
      alert("Dữ liệu vé không hợp lệ! á ê");
      return;
    }

    try {
      if (existingOrder) {
        await updateTicket({
          orderId: latestOrder.maDonDatVe,
          ticketData: orderData.chiTietDatVe,
        });
      } else {
        await placeOrder(orderData);
      }
      handleNextStep();
    } catch (error) {
      alert("Đã xảy ra lỗi khi đặt vé!");
    }
  };

  // ---------Step 2 -------------

  const handleExpiredOrder = async () => {
    if (!latestOrder) return;

    try {
      await updateOrderCanceled({ orderId: latestOrder.maDonDatVe });
      console.log("Đơn đặt vé đã hết hạn! Cập nhật trạng thái trong DB.");
      navigate(`/order/${eventId}/${programId}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  useEffect(() => {
    if (!latestOrder || latestOrder.trangThai !== 0) return;

    const orderTimestamp = new Date(latestOrder.thoiGianDatVe).getTime();
    const now = Date.now();
    const remainingTime = orderTimestamp + 1 * 60 * 1000 - now;

    if (remainingTime <= 0) {
      handleExpiredOrder();
      return;
    }

    const timeout = setTimeout(() => {
      handleExpiredOrder();
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [latestOrder]);

  const handleCompleteOrder = async (e) => {
    e.preventDefault();

    if (!orderData.chiTietDatVe || !Array.isArray(orderData.chiTietDatVe)) {
      alert("Dữ liệu vé không hợp lệ!");
      return;
    }

    try {
      await updateOrderCompleted({
        orderId: latestOrder.maDonDatVe,
        orderData: updatedOrderData,
      });

      setShowConfirm(true);
    } catch (error) {
      alert("Đã xảy ra lỗi khi đặt vé!");
    }
  };

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
            onClick={() => navigate(`/eventDetail/${eventId}`)}
            style={{ backgroundColor: "transparent", color: "#656667" }}
          >
            <LuArrowLeft />
            Quay lại
          </Button>
        </Flex>

        <Flex flexDirection="column" gap={4} w="100%">
          <EventBackground gap={8} backgroundImage={`url(${concert_cd})`}>
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
          </EventBackground>

          <Grid templateColumns="1fr 2fr" mt="24px" gap={8}>
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
                <div></div>
              )}
            </Box>
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
    </div>
  );
};

export default OrderPage;
