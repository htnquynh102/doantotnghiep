import styled from "styled-components";
import { Flex, Box, Image } from "@chakra-ui/react";

export const WrapperCard = styled.div`
  &:hover {
    .image-container img {
      transform: scale(1.1);
    }
    span {
      color: #009fda;
    }
  }
`;

export const ImageContainer = styled(Box)`
  height: 200px;
  overflow: hidden;
  display: flex;
  transition: transform 0.3s ease-in-out;
  border-radius: 32px;
`;

export const EventImage = styled(Image)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
`;

export const ContentContainer = styled(Flex)`
  padding: 20px 20px 100px 20px;
  display: flex;
  gap: 4px;
  flex-direction: column;

  .icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  span {
    font-size: 24px;
    font-weight: bold;
    color: #2f4858;
    transition: color 0.3s ease-in-out;
    height: 72px;
  }

  div button {
    padding: 12px 20px;
    background-color: #ffccea;
    border-radius: 28px;
    margin-top: 40px;
    font-weight: 600;
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
`;
