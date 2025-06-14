import styled from "styled-components";
import { Flex } from "@chakra-ui/react";

export const WrapperHeader = styled.div`
  color: #303030;
  font-weight: 600;
  justify-content: space-between;
  font-size: 15px;

  position: fixed;
  top: 12px;
  left: 0;
  right: 0;
  z-index: 100;

  .main-menu {
    cursor: pointer;

    &:hover {
      color: #009fda;
    }
  }
`;

export const WrapperLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 120px;
  }
`;

export const UserMenuWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  gap: 24px;

  .user-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: transparent;
    padding: 10px 0;
    width: 240px;
  }

  .menu-list {
    list-style: none;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 12px;
    font-weight: 500;
    overflow: hidden;
  }

  .menu-item {
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
      background: #f3f6f9;
    }
  }
`;

export const MenuWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;

  .sub-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: transparent;
    padding: 10px 0;
    width: 240px;
  }

  .menu-list {
    list-style: none;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 12px;
    font-weight: 500;
    overflow: hidden;
    color: #303030;
  }

  .menu-item {
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
      background: #f3f6f9;
    }
  }
`;
