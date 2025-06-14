import styled from "styled-components";
import { Grid, Flex, Box, Image, Button } from "@chakra-ui/react";

export const TitleWrapper = styled(Flex)`
  flex-direction: column;

  .title {
    font-size: 16px;
    text-transform: uppercase;
    font-weight: bold;
    color: #00567e;
    width: 100%;
  }
`;

export const StyledInput = styled(Grid)`
  padding: 22px 0;
  border-bottom: 1px solid #ccc;

  label {
    font-weight: 600;
    font-size: 14px;
  }

  .react-datepicker__input-container input {
    border-radius: 4px;
    width: 70%;
  }

  .address-selector {
    label {
      font-weight: 500;
    }

    .css-1lekzkb {
      border-radius: 4px !important;
    }
  }
`;

export const AvatarWrapper = styled(Box)`
  display: flex;
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

export const ImageContainer = styled(Box)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
  border-radius: 50%;
`;

export const EventImage = styled(Image)`
  width: 100%;
  height: auto;
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

export const NavBar = styled(Flex)`
  border-bottom: 2px solid #f3f6f9;
  position: relative;
`;

export const NavButton = styled(Button)`
  position: relative;
  background-color: transparent;
  color: ${(props) => (props.isActive ? "#009fda" : "#626461")};
  font-size: 14px;
  border-radius: 0;
  border-bottom: ${(props) => (props.isActive ? "2px solid #009fda" : "none")};
  margin-bottom: -2px;
  padding-bottom: 5px;
`;
