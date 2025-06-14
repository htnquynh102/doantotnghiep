import styled from "styled-components";
import { Button, Flex, Wrap } from "@chakra-ui/react";

export const StyledFlex = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const WrapperCategories = styled(Wrap)`
  gap: 30px;
  justify-content: center;
  width: 50%;
`;

export const CatButton = styled(Button)`
  background-color: #fff;
  border-radius: 32px;
  border: 1px solid #009fda;
  color: #009fda;
  &:hover {
    background-color: #009fda;
    border-radius: 16px;
    color: #fff;
  }

  &.active {
    background-color: #009fda;
    border-radius: 16px;
    color: #fff;
  }
`;

export const WrapperEvents = styled(Wrap)`
  justify-content: space-between;
`;
