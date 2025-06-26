import styled from "styled-components";
import { Input, Flex, Box, Image } from "@chakra-ui/react";

export const StyledFlex = styled(Flex)`
  flex-direction: column;

  .title {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: bold;
    color: #00567e;
    width: 100%;
  }
  .input-info {
    padding: 24px 24px 60px;
  }

  .input-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    .upload-btn {
      background-color: #fafafa;
      border-radius: 6px;
      padding: 4px 20px;
      border: 1px solid #cdcdcd;
      color: #626461;

      &:hover {
        background-color: rgb(224, 222, 222);
      }
    }
  }
`;

export const ImageContainer = styled(Box)`
  width: 110px;
  height: 110px;
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
  width: 110px;
  height: auto;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
`;
