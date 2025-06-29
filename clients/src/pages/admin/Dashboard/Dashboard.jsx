import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import SuKienChart from "./EventChart";
import { Spinner } from "@chakra-ui/react";
import { TitleWrapper } from "../style";
import { TotalWrapper, ChartWrapper } from "./style";
import { Flex, Box, Icon, Button, ButtonGroup } from "@chakra-ui/react";
import { InputGroup } from "../../../components/ui/input-group";
import { GenericTable } from "../../../components/ui/generic-table";
import { ComboBox } from "../../../components/ui/combobox";
import { CustomDateRangePicker } from "../../../components/ui/react_datepicker";
import { LuChevronsUp, LuChevronDown } from "react-icons/lu";
import no_img from "../../../assets/images/no_img.png";
import { useOrders } from "../../../hooks/useOrder";
import { useEvents, useLatestEvents } from "../../../hooks/useEvent";
import { useUsers } from "../../../hooks/useUser";
import { useOrganizers } from "../../../hooks/useOrganizer";
import TaiKhoanChart from "./AccountChart";

const Dashboard = () => {
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const { data: events, isLoading: isLoadingEvents } = useEvents();
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const { data: orgs, isLoading: isLoadingOrgs } = useOrganizers();
  const { data: latestEvent = [] } = useLatestEvents();

  const sortedUsers = useMemo(() => {
    if (!users || users.length === 0) return [];

    return users
      .slice()
      .sort((a, b) => {
        const soLuotDatVeA = Number(a.soLuotDatVe) || 0;
        const soLuotDatVeB = Number(b.soLuotDatVe) || 0;
        return soLuotDatVeB - soLuotDatVeA;
      })
      .slice(0, 10);
  }, [users]);

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

  const orderStats = calculateGrowth(orders, "thoiGianDatVe");
  const eventStats = calculateGrowth(orders, "ngayDangKy");
  const userStats = calculateGrowth(orders, "ngayTao");
  const orgStats = calculateGrowth(orders, "ngayTao");

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

  const userColumns = [
    { header: "Mã tài khoản", accessor: "maTaiKhoan" },
    { header: "Email", accessor: "email" },
    {
      header: "Tên khách hàng",
      accessor: (row) => (
        <Flex alignItems="center" gap={2}>
          <img
            src={row.anhDaiDien ? row.anhDaiDien : no_img}
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
          />
          <p style={{ margin: 0 }}>{row.tenNguoiThamGia}</p>
        </Flex>
      ),
    },
    { header: "Số lượt đặt vé", accessor: "soLuotDatVe" },
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
              <p className="label">Lượt đặt vé</p>
              <Flex gap={8} align="center">
                <p className="total-number">{orders?.length}</p>
                <Flex
                  gap={1}
                  className="stats"
                  style={{
                    backgroundColor:
                      orderStats.percentChange >= 0 ? "#009fda" : "red",
                    color: "#fff",
                  }}
                >
                  {orderStats?.percentChange >= 0 ? (
                    <LuChevronsUp />
                  ) : (
                    <LuChevronDown />
                  )}
                  <p>{orderStats.percentChange}%</p>
                </Flex>
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
                <p className="title">Người tham gia</p>
                <span>{users?.length}</span>
                <Flex gap={1} className="stats">
                  {userStats?.percentChange >= 0 ? (
                    <LuChevronsUp />
                  ) : (
                    <LuChevronDown />
                  )}
                  <p>{userStats.percentChange}%</p>
                  <p>so với tháng trước</p>
                </Flex>
              </Flex>
              <Flex className="box-item">
                <p className="title">Tô chức</p>
                <span>{orgs?.length}</span>
                <Flex gap={1} className="stats">
                  {orgStats?.percentChange >= 0 ? (
                    <LuChevronsUp />
                  ) : (
                    <LuChevronDown />
                  )}
                  <p>{orgStats.percentChange}%</p>
                  <p>so với tháng trước</p>
                </Flex>
              </Flex>
            </Flex>
          </TotalWrapper>

          <ChartWrapper direction="column">
            <Flex gap="16px">
              <Flex flex="1" className="item" direction="column" h="330px">
                <Flex justify="space-between" w="100%">
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

              <Flex flex="1" className="item" direction="column" h="330px">
                <p className="label">Lượt đăng ký trong 6 tháng gần nhất</p>
                <TaiKhoanChart />
              </Flex>
            </Flex>

            <Flex gap="16px">
              <Flex flex="3">
                <Flex
                  direction="column"
                  style={{ border: "1px solid #ccc", borderRadius: "10px" }}
                  p="12px"
                  gap={2}
                >
                  <p className="label">Sự kiện mới nhất</p>
                  <GenericTable columns={eventsColumns} data={latestEvent} />
                </Flex>
              </Flex>
              <Flex flex="1">
                <Flex
                  direction="column"
                  style={{ border: "1px solid #ccc", borderRadius: "10px" }}
                  p="12px"
                  gap={2}
                >
                  <p className="label">Khách hàng tiềm năng</p>
                  <GenericTable columns={userColumns} data={sortedUsers} />
                </Flex>
              </Flex>
            </Flex>
          </ChartWrapper>
        </Flex>
      </Flex>
    </div>
  );
};

export default Dashboard;
