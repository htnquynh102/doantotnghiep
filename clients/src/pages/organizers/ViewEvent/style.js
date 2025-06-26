import styled from "styled-components";
import { Flex, Box, Image } from "@chakra-ui/react";

export const DetailWrapper = styled(Flex)`
  flex-direction: column;

  .title {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: bold;
    color: #00567e;
    width: 100%;
  }

  .events-link {
    &:hover {
      color: #009fda;
    }
  }

  .view-content {
    flex-direction: column;

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

    label {
      color: #009fda;
      font-weight: 600;
      margin-bottom: 8px;
    }
  }
`;

export const TotalWrapper = styled(Flex)`
  .total {
    font-weight: 600;

    span {
      font-size: 32px;
    }
  }

  .box-item {
    flex: 1;
    flex-direction: column;
    box-shadow: rgba(26, 26, 26, 0.2) 0px 2px 8px 0px;
    padding: 12px;
    gap: 12px;
    border-radius: 12px;
    font-weight: 600;

    span {
      color: #009fda;
      font-size: 18px;
    }
  }
`;
