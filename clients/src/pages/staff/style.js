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
    align-items: center;
    height: 40px;
  }

  .list-link {
    font-size: 14px;

    &:hover {
      color: #009fda;
    }
  }
`;

export const StatusBar = styled(Flex)`
  border-bottom: 2px solid #f3f6f9;
  position: relative;
`;

export const StatusButton = styled(Button)`
  font-size: 14px;
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

export const CategoryForm = styled(Box)`
  border-radius: 10px;
  background-color: #f3f6f9;
  transition: all 0.3s ease;
  overflow: hidden;
  ${(props) =>
    props.isVisible
      ? `max-height: 300px; padding: 40px 20px;`
      : `max-height: 0; padding: 0;`}
`;

// ------------------------------------

export const InfoWrapper = styled(Box)`
  .info-details,
  .info-box {
    border: 1px solid #cdcdcd;
    border-radius: 10px;
    padding: 40px 28px;
  }

  .info-box {
    padding: 12px 20px;
    color: #303030;
  }
`;

export const ImageContainer = styled(Box)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyleImage = styled(Image)`
  object-fit: cover;
  object-position: center center;
`;
