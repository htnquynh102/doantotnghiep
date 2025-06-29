import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../../../components/FooterComponent/FooterComponent";
import CarouseComponent from "../../../components/CarouseComponent/CarouseComponent";
import banner2 from "../../../assets/images/banner2.png";
import firework from "../../../assets/images/firework.png";
import gallery from "../../../assets/images/gallery.png";
import race from "../../../assets/images/race.png";
import workshop from "../../../assets/images/workshop.png";
import cat_workshop from "../../../assets/images/cat_workshop.jpg";
import cat_art from "../../../assets/images/cat_art.png";
import cat_concert from "../../../assets/images/cat_concert.jpg";
import cat_other from "../../../assets/images/cat_other.png";
import { InputGroup } from "../../../components/ui/input-group";
import { ComboBox } from "../../../components/ui/combobox";
import { CustomDateRangePicker } from "../../../components/ui/react_datepicker";
import white_tickets from "../../../assets/images/icon/white_tickets.png";
import clock from "../../../assets/images/icon/clock.png";
import service from "../../../assets/images/icon/service.png";
import pay from "../../../assets/images/icon/pay.png";
import { Button, Flex } from "@chakra-ui/react";
import {
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
import { Grid, Box, GridItem } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useCategoriesForSelect } from "../../../hooks/useCategory";

const HomePage = () => {
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
      <Banner paddingInline="max(1em, 10vw)">
        <img
          src={banner2}
          style={{
            borderRadius: "32px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        <BannerContent alignItems="flex-end">
          <Flex flexDirection="column" gap={1}>
            <label htmlFor="">Từ khóa</label>
            <InputGroup style={{ width: "100%" }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </InputGroup>
          </Flex>

          <Flex flexDirection="column" gap={1}>
            <label htmlFor="">Loại</label>

            <ComboBox
              width="200px"
              height="46px"
              borderRadius="20px"
              items={categoryOptions}
              value={selectedCategory}
              onChange={(selected) => setSelectedCategory(selected)}
            />
          </Flex>

          <Flex flexDirection="column" gap={1}>
            <label htmlFor="">Thời gian</label>
            <Flex>
              <CustomDateRangePicker
                height="46px"
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </Flex>
          </Flex>

          <Button
            className="blue-btn"
            style={{ borderRadius: "32px", height: "46px" }}
            onClick={handleSearch}
          >
            <LuSearch />
            Tìm kiếm
          </Button>
        </BannerContent>
      </Banner>
      <Box py="8.5em" paddingInline="max(1em, 14vw)">
        <Grid templateColumns="2fr 3fr" gap={4}>
          <Box p={4}>
            <div>
              <ImageBox>
                <AboutImage>
                  <StyledImage
                    src={gallery}
                    style={{
                      position: "absolute",
                      right: "15px",
                      bottom: "0",
                      width: "180px",
                    }}
                  />
                </AboutImage>
                <AboutImage style={{ margin: "0" }}>
                  <StyledImage src={firework} style={{ width: "245px" }} />
                </AboutImage>
              </ImageBox>
              <ImageBox style={{ margin: "15px 0 0 0" }}>
                <AboutImage>
                  <StyledImage
                    src={workshop}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "0",
                      width: "130px",
                    }}
                  />
                </AboutImage>
                <AboutImage>
                  <StyledImage src={race} style={{ width: "160px" }} />
                </AboutImage>
              </ImageBox>
            </div>
          </Box>
          <Box p={4}>
            <AboutContent gap="10" direction="column">
              <span
                style={{
                  fontSize: "20px",
                  color: "#F3598F",
                  fontWeight: "600",
                }}
              >
                Về chúng tôi
              </span>
              <h2
                style={{
                  fontSize: "32px",
                  color: "#00567E",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                }}
              >
                Nền tảng bán vé sự kiện chính thức của thành phố Đà Nẵng
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: "#626461",
                  fontWeight: "600",
                  lineHeight: "1.2",
                }}
              >
                Được quản lý bởi Sở Du lịch thành phố Đà Nẵng. Chúng tôi giúp
                người dân và du khách tiếp cận nhanh chóng các sự kiện lớn nhỏ
                trong thành phố, từ lễ hội văn hóa, sự kiện âm nhạc, thể thao
                đến hội nghị, triển lãm.
              </p>
              <div>
                <Button
                  className="blue-btn"
                  fontSize="16px"
                  style={{
                    float: "right",
                    borderRadius: "24px",
                    padding: "0 24px",
                  }}
                >
                  Đặt vé ngay
                </Button>
              </div>
            </AboutContent>
          </Box>
        </Grid>
      </Box>
      <WrapperBring
        style={{
          height: "auto",
          backgroundColor: "#bfecff",
        }}
      >
        <StyledFlex
          flexDirection="column"
          gap={4}
          style={{ marginBottom: "80px" }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "600",
            }}
          >
            Chúng tôi mang đến
          </p>
          <p style={{ color: "#3f3c3d" }}>
            Đặt vé dễ – Tham gia nhanh – Trải nghiệm trọn vẹn
          </p>
        </StyledFlex>

        <StyledFlex gap="6">
          <StyledFlex direction="column" gap="7" flex={1} className="bring-box">
            <BringIcon>
              <StyledImage src={white_tickets} />
            </BringIcon>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Đặt vé sự kiện dễ dàng
            </span>
            <p>
              Giao diện thân thiện, dễ dàng tìm kiếm và đặt vé chỉ trong vài cú
              nhấp chuột, nhận vé điện tử ngay lập tức qua email
            </p>
          </StyledFlex>
          <StyledFlex direction="column" gap="7" flex={1} className="bring-box">
            <BringIcon>
              <StyledImage src={clock} />
            </BringIcon>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Cập nhật mới nhất
            </span>
            <p>
              Xem lịch trình chi tiết cho từng sự kiện, tìm kiếm thông minh giúp
              bạn dễ dàng tìm sự kiện phù hợp
            </p>
          </StyledFlex>
          <StyledFlex direction="column" gap="7" flex={1} className="bring-box">
            <BringIcon>
              <StyledImage src={pay} />
            </BringIcon>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              {" "}
              Thanh toán an toàn & linh hoạt
            </span>
            <p>
              Chấp nhận nhiều phương thức thanh toán, chính sách hoàn tiền minh
              bạch nếu sự kiện bị hủy.
            </p>
          </StyledFlex>
          <StyledFlex direction="column" gap="7" flex={1} className="bring-box">
            <BringIcon>
              <StyledImage src={service} />
            </BringIcon>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Hỗ trợ 24/7
            </span>
            <p>
              Hỗ trợ 24/7, giải đáp nhanh chóng mọi thắc mắc, đội ngũ chuyên
              nghiệp, luôn sẵn sàng hỗ trợ trước, trong và sau sự kiện.
            </p>
          </StyledFlex>
        </StyledFlex>
      </WrapperBring>
      <CarouseComponent />
      <Box py="8.5em" paddingInline="max(1em, 10vw)">
        <StyledFlex flexDirection="column" gap={4} marginBottom="80px">
          <p
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "600",
            }}
          >
            Bạn muốn tham gia sự kiện gì hôm nay?
          </p>
          <p style={{ width: "60%", color: "#3f3c3d" }}>
            Khám phá và đặt vé cho hàng trăm sự kiện đa dạng – từ âm nhạc, hội
            thảo đến thể thao hay giải trí. Giao diện thân thiện, tìm kiếm nhanh
            chóng, thanh toán an toàn và hỗ trợ tận tâm – tất cả trong một nền
            tảng.
          </p>
        </StyledFlex>

        <Grid
          h="200px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(4, 1fr)"
          gap={4}
        >
          <GridItem colSpan={2}>
            <a href="">
              <CatImgContainer>
                <StyledImage src={cat_workshop} />
                <div
                  className="overlay"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, rgb(25, 25, 25) 76.5563%)",
                  }}
                >
                  <p>Workshop</p>
                </div>
              </CatImgContainer>
            </a>
          </GridItem>
          <GridItem colSpan={1}>
            <a href="">
              <CatImgContainer>
                <StyledImage src={cat_concert} />
                <div
                  className="overlay"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, rgb(25, 25, 25) 76.5563%)",
                  }}
                >
                  <p>Nhạc sống</p>
                </div>
              </CatImgContainer>
            </a>
          </GridItem>
          <GridItem colSpan={1}>
            <a href="">
              <CatImgContainer>
                <StyledImage src={cat_art} />
                <div
                  className="overlay"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, rgb(25, 25, 25) 76.5563%)",
                  }}
                >
                  <p>Văn hóa & nghệ thuật</p>
                </div>
              </CatImgContainer>
            </a>
          </GridItem>
          <GridItem colSpan={1}>
            <a href="">
              <CatImgContainer>
                <StyledImage src={race} />
                <div
                  className="overlay"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, rgb(25, 25, 25) 76.5563%)",
                  }}
                >
                  <p>Thể thao</p>
                </div>
              </CatImgContainer>
            </a>
          </GridItem>
          <GridItem colSpan={3}>
            <a href="">
              <CatImgContainer>
                <StyledImage src={cat_other} />
                <div
                  className="overlay"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, rgb(25, 25, 25) 76.5563%)",
                  }}
                >
                  <p>Loại hình khác</p>
                </div>
              </CatImgContainer>
            </a>
          </GridItem>
        </Grid>
      </Box>

      <Box mt="340px">
        <FooterComponent />
      </Box>
    </div>
  );
};

export default HomePage;
