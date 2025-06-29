import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { TitleWrapper, TotalWrapper, ChartWrapper } from "./style";
import { Flex } from "@chakra-ui/react";
import { GenericTable } from "../../../components/ui/generic-table";
import { ComboBox } from "../../../components/ui/combobox";
import { LuChevronsUp, LuChevronDown } from "react-icons/lu";
import no_img from "../../../assets/images/no_img.png";
import { useOrders } from "../../../hooks/useOrder";
import { useEvents } from "../../../hooks/useEvent";
import { useOrganizerById } from "../../../hooks/useOrganizer";
import DoanhThuChart from "./RevenueChart";
import SuKienChart from "./EventChart";
import { useAuth } from "../../../hooks/useAccount";

const Dashboard = () => {
  const { accountId } = useAuth();
  const { data: org } = useOrganizerById(accountId);
  const { data: rawOrders, isLoading: isLoadingOrders } = useOrders(
    org?.maCTySuKien
  );
  const orders = rawOrders?.filter((order) => order.trangThai === 1) || [];
  const { data: events, isLoading: isLoadingEvents } = useEvents(accountId);

  const tongDoanhThu = events.reduce((tong, event) => {
    const doanhThu = Number(event.tongDoanhThu) || 0;
    return tong + doanhThu;
  }, 0);

  const sortedEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    return events
      .slice()
      .sort((a, b) => {
        const doanhThuA = Number(a.tongDoanhThu) || 0;
        const doanhThuB = Number(b.tongDoanhThu) || 0;
        return doanhThuB - doanhThuA; // giảm dần
      })
      .slice(0, 3); // chỉ lấy top 3
  }, [events]);

  const now = dayjs();
  const minus30 = now.subtract(30, "day");
  const minus60 = now.subtract(60, "day");

  const calculateGrowth = (list, dateField) => {
    const inRange = (date, from, to) =>
      dayjs(date).isAfter(from) && dayjs(date).isBefore(to);

    const current = list?.filter((item) =>
      dayjs(item[dateField]).isAfter(minus30)
    );

    const previous = list?.filter((item) =>
      inRange(item[dateField], minus60, minus30)
    );

    const currentCount = current?.length;
    const previousCount = previous?.length;

    const percentChange =
      previousCount === 0
        ? currentCount > 0
          ? 100
          : 0
        : ((currentCount - previousCount) / previousCount) * 100;

    return {
      currentCount,
      previousCount,
      percentChange: +percentChange.toFixed(1),
    };
  };

  const eventStats = calculateGrowth(events, "ngayDangKy");
  const orderStats = calculateGrowth(orders, "thoiGianThanhToan");

  const eventsColumns = [
    {
      header: "Tên sự kiện",
      accessor: (row) => (
        <Flex alignItems="center" gap={2}>
          <img
            src={row.anhBia ? row.anhBia : no_img}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <p style={{ margin: 0 }}>{row.tenSuKien}</p>
        </Flex>
      ),
    },
    {
      header: "Doanh thu",
      accessor: "tongDoanhThu",
    },
    {
      header: "Ngày đăng ký",
      accessor: (row) => {
        const date = new Date(row.ngayDangKy);
        return date.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      header: "Địa điểm",
      accessor: (row) => (
        <p>
          {row.diaDiemToChuc}, {row.soNhaTenDuong}, {row.tenPhuongXa},{" "}
          {row.tenQuanHuyen}, {row.tenTinhThanh}
        </p>
      ),
    },
  ];

  const [selectedTimeForEvent, setSelectedTimeForEvent] = useState(6);

  const timeOptions = [
    { label: "3 tháng", value: 3 },
    { label: "6 tháng", value: 6 },
    { label: "12 tháng", value: 12 },
  ];

  const handleEventChartChange = (selectedItem) => {
    setSelectedTimeForEvent(selectedItem.value);
  };

  return (
    <div>
      <Flex flexDirection="column">
        <TitleWrapper mb={8}>
          <p className="title">Quản lý tài khoản</p>
        </TitleWrapper>

        <Flex className="content" flexDirection="column" gap={6}>
          <TotalWrapper justify="space-between" mt="40px">
            <Flex direction="column" className="total" flex="0 0 40%">
              <p className="label">Doanh thu</p>
              <Flex gap={8} align="center">
                <p className="total-number">
                  {Number(tongDoanhThu).toLocaleString("vi-VN") + "đ"}
                </p>
              </Flex>
            </Flex>

            <Flex flex="0 0 60%" gap={4}>
              <Flex className="box-item">
                <p className="title">Sự kiện</p>
                <span>{events?.length}</span>
                <Flex gap={1} className="stats">
                  {eventStats?.percentChange >= 0 ? (
                    <LuChevronsUp />
                  ) : (
                    <LuChevronDown />
                  )}
                  <p>{eventStats.percentChange}%</p>
                  <p>so với tháng trước</p>
                </Flex>
              </Flex>
              <Flex className="box-item">
                <p className="title">Lượt đặt vé</p>
                <span>{orders?.length}</span>
                <Flex gap={1} className="stats">
                  {orderStats?.percentChange >= 0 ? (
                    <LuChevronsUp />
                  ) : (
                    <LuChevronDown />
                  )}
                  <p>{orderStats.percentChange}%</p>
                  <p>so với tháng trước</p>
                </Flex>
              </Flex>
            </Flex>
          </TotalWrapper>

          <ChartWrapper>
            <Flex direction="column" flex="1" gap={6}>
              <Flex className="item" direction="column">
                <Flex justify="space-between">
                  <p className="label">Số lượng sự kiện theo tháng</p>

                  <ComboBox
                    width="120px"
                    height="30px"
                    borderRadius="8px"
                    items={timeOptions}
                    value={timeOptions.find(
                      (item) => item.value === selectedTimeForEvent
                    )}
                    onChange={handleEventChartChange}
                  />
                </Flex>

                <SuKienChart monthRange={selectedTimeForEvent} />
              </Flex>
            </Flex>

            <Flex className="item" flex="1" direction="column">
              <p className="label">Doanh thu trong 6 tháng gần nhất</p>
              <DoanhThuChart />
            </Flex>
          </ChartWrapper>

          <Flex
            direction="column"
            style={{ border: "1px solid #ccc", borderRadius: "10px" }}
            p="12px"
            gap={2}
          >
            <p className="label">Sự kiện có doanh thu cao nhât</p>
            <GenericTable columns={eventsColumns} data={sortedEvents} />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default Dashboard;
