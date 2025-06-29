import styled from "styled-components";
import { Flex, Box, Image, Grid } from "@chakra-ui/react";

export const TotalWrapper = styled(Flex)`
  .total {
    .label {
      font-weight: 600;
    }

    .total-number {
      font-size: 36px;
      font-weight: 600;
    }
  }

  .stats {
    padding: 2px 4px;
    border-radius: 8px;
    align-items: center;
    font-size: 13px;
  }

  .box-item {
    flex: 1;
    flex-direction: column;
    box-shadow: rgba(26, 26, 26, 0.2) 0px 2px 8px 0px;
    padding: 12px;
    gap: 12px;
    border-radius: 12px;

    .title {
      font-weight: 600;
    }

    span {
      color: #009fda;
      font-size: 18px;
      font-weight: 600;
    }
  }
`;

export const ChartWrapper = styled(Flex)`
  gap: 20px;

  .item {
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 16px;
    gap: 16px;
  }

  .label {
    color: #464255;
    font-weight: 600;
  }
`;
