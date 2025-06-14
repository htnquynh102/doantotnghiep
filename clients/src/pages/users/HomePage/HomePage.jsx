import HeaderComponent from "../../../components/HeaderComponent/HeaderComponent";
import CarouseComponent from "../../../components/CarouseComponent/CarouseComponent";
import banner from "../../../assets/images/banner.png";
import firework from "../../../assets/images/firework.png";
import gallery from "../../../assets/images/gallery.png";
import race from "../../../assets/images/race.png";
import workshop from "../../../assets/images/workshop.png";
import cat_workshop from "../../../assets/images/cat_workshop.jpg";
import cat_art from "../../../assets/images/cat_art.png";
import cat_concert from "../../../assets/images/cat_concert.jpg";
import cat_other from "../../../assets/images/cat_other.png";

import white_tickets from "../../../assets/images/icon/white_tickets.png";
import clock from "../../../assets/images/icon/clock.png";
import service from "../../../assets/images/icon/service.png";
import pay from "../../../assets/images/icon/pay.png";
import { Button } from "@chakra-ui/react";
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

const HomePage = () => {
  return (
    <div
      style={{
        paddingTop: "80px",
        background:
          "linear-gradient(0deg, #ffffff 93%, var(--token-9316698b-f2ef-4a1e-8616-6a3a01368917, rgb(191, 236, 255)) 100%)",
      }}
    >
      <HeaderComponent />
      <Banner style={{ backgroundImage: `url(${banner})` }}>
        <BannerContent>
          <p
            style={{
              textTransform: "uppercase",
              fontSize: "36px",
              fontWeight: "500",
              color: "#f3598f",
            }}
          >
            Khám phá sự kiện hấp dẫn
          </p>
          <p
            style={{
              textTransform: "uppercase",
              fontSize: "60px",
              fontWeight: "600",
              color: "#009fda",
            }}
          >
            Đà Nẵng
          </p>
          <p
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#3d589f",
              marginTop: "20px",
              letterSpacing: "0.5px",
            }}
          >
            Đừng bỏ lỡ trải nghiệm có một không hai - Đặt vé ngay
            <br /> cho sự kiện yêu thích của bạn với hệ thống mua vé <br />
            online tiện lợi của chúng tôi{" "}
          </p>
          <div>
            <Button
              className="blue-btn"
              fontSize="20px"
              py={5}
              style={{ marginTop: "60px", borderRadius: "24px" }}
            >
              Đặt vé ngay
            </Button>
          </div>
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
    </div>
  );
};

export default HomePage;
