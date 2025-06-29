import styled from "styled-components";
import { Box, Flex, Image } from "@chakra-ui/react";

export const EventBackground = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  width: 100%;
  border-radius: 6px;
  position: relative;
  background-size: cover;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    backdrop-filter: blur(7px);
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background: rgba(14, 14, 14, 0.4);
    z-index: 1;
  }

  .event-name {
    color: #fff;
    font-size: 22px;
    font-weight: 600;
    text-transform: uppercase;
    z-index: 2;
  }

  .event-info {
    flex-direction: column;
    z-index: 2;
    font-size: 14px;

    .icon {
      color: #009fda;
    }

    p {
      color: #fff;
    }
  }
`;

export const OrderDetailWrapper = styled(Flex)`
  flex-direction: column;

  .total {
    font-size: 20px;
    font-weight: 600;
  }

  .selected-tickets {
    flex-direction: column;
    padding: 16px;
    border-radius: 12px;
    border: 1px solid #e2e2e2;
  }
`;

export const TicketCard = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  border-radius: 16px;
  background-color: #e9f4f9;
  font-weight: 600;
  color: #656667;

  span {
    font-weight: 500;
  }

  .ticket-number {
    font-size: 13px;
  }
`;

export const TicketTable = styled.div`
  width: 100%;
  font-size: 14px;

  .ticket-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e2e2;
  }
`;

export const UserWrapper = styled(Box)`
  padding: 16px;
  border: 1px solid #e2e2e2;
  border-radius: 12px;

  .title {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .user-info {
    p {
      color: #656667;
    }
  }
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
  padding: 36px;
  border-radius: 5px;
  text-align: center;
  width: 400px;
  min-width: 300px;
  box-shadow: 0px 5px 20px 0px rgb(66, 67, 68);
  position: relative;

  .button-wrapper {
    position: absolute;
    top: 0;
    right: 0;

    button {
      padding: 12px;
    }
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
