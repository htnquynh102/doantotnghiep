import styled from "styled-components";
import { Flex } from "@chakra-ui/react";

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

  .content {
    flex-direction: column;
    gap: 40px;

    .progress-bar {
      justify-content: center;
      font-size: 14px;
    }

    .progress-item {
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .create-form {
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
