import styled from "styled-components";
import { Image, Flex, Box, Wrap } from "@chakra-ui/react";

export const ContentWrapper = styled(Flex)`
  .section-title {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 600;
  }
`;

export const InfoContainer = styled(Flex)`
  display: flex;
  flex-direction: column;

  .icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }

  .event-detail button {
    padding: 12px 24px;
    background-color: #dcf4ff;
    border-radius: 28px;
    margin-top: 40px;
    font-weight: 600;
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }
`;

export const ImageContainer = styled(Box)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease-in-out;
`;

export const EventImage = styled(Image)`
  width: 80%;
  height: 400px;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.3s ease-in-out;
  border-radius: 32px;
`;

export const IntroductionContainer = styled(Flex)`
  em {
    font-style: italic;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 1.5rem;
    font-weight: 600;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  h3 {
    font-size: 1.15rem;
  }

  h4 {
    font-size: 1.05rem;
  }

  h5 {
    font-size: 1rem;
  }

  h6 {
    font-size: 0.95rem;
  }

  code {
    background-color: #ccc;
    border-radius: 0.4rem;
    color: #303030;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  ul,
  ol {
    padding: 0 0 0 1rem;
    margin: 1.25rem 0 1.25rem 1.25rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  blockquote {
    border-left: 3px solid #ccc;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }
`;

export const TicketContainer = styled.div`
  margin-bottom: 100px;

  .ticket-table {
    border: 1px solid #e2e2e2;
  }

  button {
    padding: 12px 24px;
    font-size: 14px;
    background-color: #dcf4ff;
    border-radius: 20px;
    font-weight: 600;
    &:hover {
      background-color: #000;
      color: #fff;
    }
  }

  .event-type {
    padding: 12px;
    border-bottom: 1px solid #e2e2e2;
  }
`;

export const PopUp = styled(Flex)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

export const PopupContent = styled(Flex)`
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
`;
