import styled from "styled-components";
import { Image, Flex, Box, Wrap } from "@chakra-ui/react";

export const StyledFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ContentWrapper = styled(Flex)`
  .left-col {
    padding-right: 40px;

    .avatar {
      margin-bottom: 28px;
    }

    .account-nav {
      button {
        height: 52px;
        align-items: center;
        justify-content: flex-start;
        font-size: 15px;
        border-radius: 32px;

        &:hover {
          background-color: #dcf4ff;
          color: #009fda;
          font-weight: bold;
        }
      }
    }
  }
`;

export const ImageContainer = styled(Box)`
  width: 80px;
  height: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
  border-radius: 50%;
  border: 6px solid #e2e2e2;
`;

export const EventImage = styled(Image)`
  width: 80px;
  height: auto;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
`;
