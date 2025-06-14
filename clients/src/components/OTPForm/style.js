import styled from "styled-components";
import { Flex } from "@chakra-ui/react";

export const CardWrapper = styled.div`
  position: relative;
`;

export const Card = styled(Flex)`
  border: none;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;

  h6 {
    color: red;
    font-size: 20px;
  }
`;

export const OTPContainer = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
`;

export const OTPInput = styled.input`
  width: 40px;
  height: 40px;
  margin: 5px;
  text-align: center;
  border-radius: 5px;
  border: 2px solid #d2dae3;

  &:focus {
    box-shadow: none;
    border: 2px solid red;
  }
`;

export const CardBottom = styled(Flex)`
  height: 60px;
  width: 100%;
  background-color: #fff;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  bottom: -90px;
  position: absolute;
  border-radius: 0 0 5px 5px;

  button {
    color: #009fda;
  }
`;
