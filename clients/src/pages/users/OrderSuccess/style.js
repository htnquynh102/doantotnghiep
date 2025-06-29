import styled from "styled-components";
import { Flex, Image, Box } from "@chakra-ui/react";

export const TableContainer = styled(Box)`
  margin: 16px 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 100%;

  .main-table {
    width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 14px;
  }

  th {
    background-color: #e1ecf1;
    font-weight: bold;
  }

  th,
  td {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }
`;

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

export const Banner = styled(Box)`
  height: 500px;
  width: 100%;
  aspect-ratio: 1200 / 628;
  background-size: cover;
  background-position: center;
  position: relative;
`;

export const BannerContent = styled(Flex)`
  position: absolute;
  bottom: 0;
  width: 60%;
  justify-content: space-between;
  background-color: #fff;
  left: 50%;
  transform: translate(-50%, 50%);
  padding: 20px 48px 40px;
  border-radius: 48px;
  z-index: 10;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 3px 20px 0px;

  label {
    color: rgb(108, 108, 108);
    font-size: 14px;
  }
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
