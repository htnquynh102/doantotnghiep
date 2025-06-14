import styled from "styled-components";
import { Flex, Box, Image } from "@chakra-ui/react";

export const TitleWrapper = styled(Box)`
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  color: #00567e;
  width: 100%;
`;

export const ButtonWrapper = styled(Flex)`
  gap: 12px;
  margin-bottom: 40px;

  button {
    border-radius: 28px;
    border: 1px solid #ccc;
    color: #ccc;
    font-size: 14px;
    padding: 6px 16px;

    &:hover {
      color: #009fda;
      border: 1px solid #009fda;
    }
  }
`;

export const OrderInformation = styled(Flex)`
  justify-content: space-between;
  padding: 16px 40px;
  background-color: #f7f7f5;

  .label {
    color: #7c7d81;
    font-size: 13px;
  }
`;

export const EventCard = styled(Flex)`
  flex-direction: column;
  padding: 16px 40px;
  gap: 16px;

  .event-container {
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;

    .event-info {
      flex-direction: column;
      color: #616161;

      .event-name {
        color: #009fda;
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
    }
  }

  .view-tickets-btn {
    color: #009fda;
    padding: 12px;
    border-radius: 50%;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: #dcf4ff;
    }
  }
`;

export const StatusWrapper = styled(Box)`
  padding: 4px 16px;
  border-radius: 16px;

  &.green {
    background-color: rgba(106, 238, 148, 0.15);
    color: #43a047;
  }

  &.yellow {
    background-color: rgba(246, 201, 65, 0.15);
    color: rgb(239, 180, 0);
  }

  &.red {
    background-color: rgba(245, 85, 98, 0.15);
    color: #d51c55;
  }

  span {
    font-weight: 600;
    font-size: 13px;

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
  }
`;

export const ImageContainer = styled(Box)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const EventImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
`;
