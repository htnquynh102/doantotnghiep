import styled from "styled-components";
import { Flex, Box, Image, Button } from "@chakra-ui/react";

export const StyledFlex = styled(Flex)`
  flex-direction: column;
  color: #626461;

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
  width: 110px;
  height: 110px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
  border-radius: 50%;
`;

export const EventImage = styled(Image)`
  width: 110px;
  height: auto;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
`;

export const StatusBar = styled(Flex)`
  border-bottom: 2px solid #f3f6f9;
  position: relative;
`;

export const StatusButton = styled(Button)`
  position: relative;
  background-color: transparent;
  color: ${(props) => (props.isActive ? "#009fda" : "#626461")};
  border-radius: 0;
  border-bottom: ${(props) => (props.isActive ? "2px solid #009fda" : "none")};
  margin-bottom: -2px;
  padding-bottom: 5px;
`;

export const StatusWrapper = styled.span`
  font-weight: 600;

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: currentColor;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }
`;

export const SortButton = styled(Flex)`
  position: relative;
  height: 36px;

  .sort-btn {
    padding: 0 10px;
    border: 1px solid #cdcdcd;
    border-radius: 10px;
  }

  .sort-options {
    top: 110%;
    right: 0;
    background-color: #fff;
    position: absolute;
    z-index: 2;
  }

  .option {
    button {
      background-color: transparent;
      color: #646261;
    }

    &:hover {
      background-color: #e0f7fa;
    }
  }
`;
