import styled from "styled-components";
import { Input, Flex, Box, Image } from "@chakra-ui/react";

export const StyledFlex = styled(Flex)`
  flex-direction: column;

  .title {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: bold;
    color: #00567e;
    width: 100%;
    margin-bottom: 24px;
  }
`;

export const ImageContainer = styled(Box)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
`;

export const EventImage = styled(Image)`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
`;

export const PopUp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

export const PopupContent = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  min-width: 300px;
`;

export const InfoWrapper = styled(Box)`
  .info-details {
    border: 1px solid #cdcdcd;
    border-radius: 10px;
    padding: 40px 28px;
  }

  .blue-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
