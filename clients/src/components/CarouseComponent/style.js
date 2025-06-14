import styled from "styled-components";
import { Box, Flex, Image, Button } from "@chakra-ui/react";

export const WrapperEvent = styled(Box)`
  display: flex;
  overflow-x: hidden;
  scroll-behavior: smooth;
  width: 100%;
`;

export const ParentDiv = styled(Flex)`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  gap: 40px;
  padding: 0 20px;
`;

export const ChildDiv = styled(Box)`
  width: 50%;
  height: 90%;
  font-size: 15px;
  color: #303030;
  position: relative;

  &:hover {
    .image-container img {
      transform: scale(1.1);
    }
    span {
      color: #009fda;
    }
  }
`;

// -------------------

export const ImageContainer = styled(Box)`
  height: 300px;
  overflow: hidden;
  display: flex;
  transition: transform 0.3s ease-in-out;
  border-radius: 32px;
`;

export const EventImage = styled(Image)`
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
`;

// -----------------------------

export const ContentContainer = styled(Flex)`
  padding: 20px 20px 100px 20px;
  display: flex;
  gap: 4px;
  flex-direction: column;

  span {
    font-size: 24px;
    font-weight: bold;
    color: #2f4858;
    height: 54px;
    transition: color 0.3s ease-in-out;
  }
`;

// ----------------------------------

export const NavButton = styled(Button)`
  width: 60px;
  height: 60px;
  border-radius: 0;

  &:hover {
    color: #009fda;
    background-color: #fff;
    border: 1px solid #009fda;
  }
`;

// ---------------------------------------
