import styled from "styled-components";
import { Box, Image } from "@chakra-ui/react";

export const ImageContainer = styled(Box)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
`;

export const StyledImage = styled(Image)`
  width: 200px;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
  border-radius: 32px;
`;
