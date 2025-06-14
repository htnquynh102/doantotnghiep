import styled from "styled-components";
import { Flex, Image, Box } from "@chakra-ui/react";

export const StyledFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledImage = styled(Image)`
  max-width: 100%;
  width: 100%;
`;

// ------------------------

export const Banner = styled.div`
  width: 100%;
  aspect-ratio: 1200 / 628;
  background-size: cover;
  background-position: center;
`;

export const BannerContent = styled.div`
  position: relative;
  width: 100%;
  padding: 8.5em max(1em, 10vw);
  display: flex;
  flex-direction: column;
`;

// --------------------------------
export const ImageBox = styled.div`
  display: flex;
`;

export const AboutImage = styled.div`
  width: 50%;
  position: relative;
`;

export const AboutContent = styled(Flex)`
  padding: 3rem 0 3rem 2rem;
`;

// ---------------------------

export const WrapperBring = styled.div`
  padding: 7.5em max(0.5em, 10vw);
  color: #303030;
  position: relative;
  font-size: 15px;
  text-align: center;

  .bring-box {
    background-color: #fff;
    padding: 60px 32px;
    border-radius: 32px;
    height: 100%;
  }
`;

export const BringIcon = styled.div`
  border-radius: 10px;
  padding: 12px;
`;

// -----------------------------

export const CatImgContainer = styled(Box)`
  height: 340px;
  overflow: hidden;
  display: flex;
  transition: transform 0.3s ease-in-out;
  border-radius: 32px;
  position: relative;

  .overlay {
    position: absolute;
    bottom: 0;
    z-index: 1;
    height: 28%;
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 24px;
    font-size: 18px;
    font-weight: 600;
  }
`;
