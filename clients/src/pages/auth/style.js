import styled from "styled-components";
import { Input, Flex } from "@chakra-ui/react";

export const ContentWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .left-col {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #009fda;
    color: #fff;
    height: 100%;

    .signup-btn {
      border: 1px solid #fff;
      border-radius: 32px;
      padding: 8px 24px;

      &:hover {
        background-color: #fff;
        color: #303030;
      }
    }
  }

  .right-col {
    flex-direction: column;
    align-items: center;

    .section-title {
      text-align: center;
      font-size: 32px;
      font-weight: bold;
      color: #009fda;
    }

    .role-option {
      margin-bottom: 28px;
    }

    .submit-btn {
      background-color: #009fda;
      color: #fff;
      border-radius: 32px;
      padding: 8px 40px;
      font-weight: 500;
      font-size: 15px;
    }
  }

  p {
    text-align: center;
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
