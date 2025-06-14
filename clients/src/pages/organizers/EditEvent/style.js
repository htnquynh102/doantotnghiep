import styled from "styled-components";
import { Flex, Box, Image } from "@chakra-ui/react";

export const EditWrapper = styled(Flex)`
  flex-direction: column;

  .title {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: bold;
    color: #00567e;
    width: 100%;
    margin-bottom: 24px;
  }

  .events-link {
    &:hover {
      color: #009fda;
    }
  }

  .edit-content {
    flex-direction: column;

    .event-title {
      justify-content: space-between;
      align-items: flex-start;

      .event-info {
        flex-direction: column;

        .event-name {
          color: #009fda;
          font-weight: 600;
          font-size: 17px;
          margin-right: 8px;
        }

        .event-status::before {
          content: "";
          display: inline-block;
          width: 6px;
          height: 5px;
          background-color: currentColor;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
    }

    label {
      color: #009fda;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .program-box {
      border: 1px solid #cdcdcd;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 32px;

      .close-box-btn {
        background-color: #fff;
        font-size: 24px;
      }
    }

    .ticket-model {
      background-color: #f3f6f9;

      label {
        color: #626461 !important;
        font-weight: 500;
      }

      button {
        &:hover {
          background-color: #000;
        }
      }
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
  padding: 30px;
  border-radius: 8px;
  min-width: 300px;

  label {
    color: #009fda;
    font-weight: 600;
    margin-bottom: 8px;
  }
`;
