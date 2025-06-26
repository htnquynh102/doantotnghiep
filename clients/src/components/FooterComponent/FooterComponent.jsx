import logo from "../../assets/images/logo.png";
import { StyledImage, ImageContainer } from "./style";
import { Flex, Box } from "@chakra-ui/react";
import { LuPhoneCall, LuMail, LuMapPin } from "react-icons/lu";
import facebook from "../../assets/images/icon/facebook.png";
import twitter from "../../assets/images/icon/twitter.png";
import linkedin from "../../assets/images/icon/linkedin.png";

const FooterComponent = () => {
  return (
    <Flex pt="8.5em" paddingInline="max(1em, 10vw)" flexDirection="column">
      <Flex justifyContent="space-between" pb={12}>
        <ImageContainer>
          <StyledImage src={logo} />
        </ImageContainer>

        <Flex gap={16}>
          <Flex flexDirection="column" gap={4}>
            <p style={{ color: "#007FBB", fontWeight: "600" }}>Liên kết</p>

            <Flex flexDirection="column" gap={2}>
              <p>Trang chủ</p>
              <p>Sự kiện</p>
              <p>Liên hệ</p>
            </Flex>
          </Flex>

          <Flex flexDirection="column" gap={4}>
            <p style={{ color: "#007FBB", fontWeight: "600" }}>Liên hệ</p>
            <Flex flexDirection="column" gap={2}>
              <Flex alignItems="center" gap={2}>
                <LuPhoneCall />
                <p>+84 767517057</p>
              </Flex>

              <Flex alignItems="center" gap={2}>
                <LuMail />
                <p>dn_event@sukiendanang.vn</p>
              </Flex>

              <Flex alignItems="center" gap={2}>
                <LuMapPin />
                <p>48 Cao Thắng, Thanh Bình, Hải Châu, Đà Nẵng</p>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex gap={2}>
          <Box width="32px" height="32px">
            <img src={facebook} />
          </Box>
          <Box width="32px" height="32px">
            <img src={twitter} alt="" />
          </Box>
          <Box width="32px" height="32px">
            <img src={linkedin} alt="" />
          </Box>
        </Flex>
      </Flex>

      <Box
        w="100%"
        justifyContent="center"
        alignItems="center"
        py={4}
        borderTop="1px solid #ccc"
      >
        <p style={{ textAlign: "center", color: "#007FBB" }}>
          © 2025 Sự kiện Đà Nẵng. All rights reserved.
        </p>
      </Box>
    </Flex>
  );
};

export default FooterComponent;
