import { useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../../components/FooterComponent/FooterComponent";
import CarouseComponent from "../../../components/CarouseComponent/CarouseComponent";
import success from "../../../assets/images/success.png";
import { Button, Flex } from "@chakra-ui/react";
import {
  TableContainer,
  Banner,
  BannerContent,
  ImageBox,
  StyledImage,
  AboutImage,
  AboutContent,
  WrapperBring,
  StyledFlex,
  BringIcon,
  CatImgContainer,
} from "./style";
import { LuBadgeCheck } from "react-icons/lu";
import { Grid, Box, GridItem } from "@chakra-ui/react";
import { useCategoriesForSelect } from "../../../hooks/useCategory";
import { useOrderById } from "../../../hooks/useOrder";
import { useAuth } from "../../../hooks/useAccount";
import { useUserById } from "../../../hooks/useUser";

const OrderSuccess = () => {
  const { accountId } = useAuth();
  const { orderId } = useParams();
  const { data: user } = useUserById(accountId);
  const { data: order } = useOrderById(orderId);
  const navigate = useNavigate();
  const { data: categoryOptions = [] } = useCategoriesForSelect();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState([
    searchParams.get("from") || null,
    searchParams.get("to") || null,
  ]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (query) params.set("query", query);

    if (selectedCategory?.value) {
      params.append("cate", selectedCategory.value);
    } else {
      params.append("cate", "all");
    }
    if (dateRange[0]) {
      params.set("from", new Date(dateRange[0]).toISOString().split("T")[0]);
    }

    if (dateRange[1]) {
      params.set("to", new Date(dateRange[1]).toISOString().split("T")[0]);
    }

    navigate(`/events?${params.toString()}`);
  };

  return (
    <div
      style={{
        paddingTop: "120px",
        background:
          "linear-gradient(0deg, #ffffff 10%, rgb(191, 236, 255) 100%)",
        backgroundSize: `100% 200px`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <HeaderComponent />

      <Flex
        paddingInline="max(1em, 10vw)"
        direction="column"
        alignItems="center"
      >
        <Flex direction="column" alignItems="center" w="100%" gap={4} mb={8}>
          <img src={success} width="280px" />
          <Flex align="center" gap={3} style={{ color: "#007FBB" }}>
            <LuBadgeCheck style={{ fontSize: "30px" }} />
            <p style={{ fontSize: "22px", fontWeight: "600" }}>
              Giao dịch thành công
            </p>
          </Flex>
        </Flex>

        <TableContainer>
          <table className="main-table">
            <tbody>
              <tr>
                <th style={{ width: "240px" }}>Tên</th>
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
        </TableContainer>

        <TableContainer className="table-container">
          <table className="main-table">
            <thead>
              <tr>
                <th>Ngày đặt hàng</th>
                <th>Ngày thanh toán</th>
                <th>Phương thức thanh toán</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {new Date(order?.thoiGianDatVe).toLocaleString("vi-VN")}
                </td>
                <td>
                  {new Date(order?.thoiGianThanhToan).toLocaleString("vi-VN")}
                </td>
                <td>{order?.phuongThucThanhToan}</td>
                <td>
                  {order?.chiTietDatVe
                    .reduce(
                      (total, ve) =>
                        total + parseInt(ve.giaBan) * ve.soLuongDat,
                      0
                    )
                    .toLocaleString()}
                  đ{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </TableContainer>

        <Flex w="60%" justify="space-between" gap={4}>
          <Button
            className="blue-btn"
            w="50%"
            onClick={() =>
              navigate(`/user/joined-events/${orderId}/list-ticket`)
            }
          >
            Xem vé
          </Button>

          <Button
            className=" blue-outline-btn"
            w="50%"
            onClick={() => navigate(`/`)}
          >
            Trang chủ
          </Button>
        </Flex>
      </Flex>

      <Box mt="100px">
        <FooterComponent />
      </Box>
    </div>
  );
};

export default OrderSuccess;
