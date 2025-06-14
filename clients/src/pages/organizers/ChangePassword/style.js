import styled from "styled-components";
import { Box, Flex } from "@chakra-ui/react";

export const TitleWrapper = styled(Box)`
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
  color: #00567e;
  width: 100%;
  margin-bottom: 24px;
`;

export const ContentWrapper = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;

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
