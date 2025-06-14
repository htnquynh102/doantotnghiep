import styled from "styled-components";
import { Flex, Box, Image } from "@chakra-ui/react";

export const TitleWrapper = styled(Box)`
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  color: #00567e;
  width: 100%;
`;

export const TicketWrapper = styled(Flex)`
  position: relative;
  background: #e1ecf1;
  padding: 32px;
  margin-bottom: 20px;
  overflow: hidden;

  &::before,
  &::after,
  span::before,
  span::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    z-index: 1;
  }

  &::before {
    top: 0;
    left: 0;
    border-radius: 0 0 100% 0;
  }

  &::after {
    bottom: 0;
    right: 0;
    border-radius: 100% 0 0 0;
  }

  span::before {
    top: 0;
    right: 0;
    border-radius: 0 0 0 100%;
  }

  span::after {
    bottom: 0;
    left: 0;
    border-radius: 0 100% 0 0;
  }

  .event-name {
    text-transform: uppercase;
    font-weight: 600;
  }

  .ticket-info {
    margin-left: 32px;
    flex-direction: column;

    p {
      font-size: 13px;
    }

    span {
      font-weight: 600;
    }
  }
`;

export const ContentWrapper = styled(Box)`
  .table-container {
    margin: 16px 0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

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

export const ImageContainer = styled(Flex)`
  overflow: hidden;
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
