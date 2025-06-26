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
`;

export const CatButton = styled(Button)`
  // background-color: #fff;
  background-color: ${({ selected }) => (selected ? "#009fda" : "#fff")};
  border: 1px solid #009fda;
  border-radius: 32px;
  // color: #009fda;
  color: ${({ selected }) => (selected ? "#fff" : "#009fda")};

  &:hover {
    background-color: #009fda;
    color: #fff;
  }
`;

// export const WrapperEvents = styled(Wrap)`
//   // justify-content: space-between;

// `;

export const WrapperEvents = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  justify-items: center;
`;
