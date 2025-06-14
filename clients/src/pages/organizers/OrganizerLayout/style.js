import styled from "styled-components";
import { Image, Flex, Box } from "@chakra-ui/react";

export const LayoutWrapper = styled(Box)`
  background-color: #fff !important;
  position: relative;
  width: 100%;
  padding: 0;
  margin-right: auto;
  margin-left: auto;
  max-width: 1320px;

  .sidebar {
    flex-direction: column;
    background-color: #f3f6f9 !important;
    margin-left: -250px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    height: 100vh;
    overflow-y: auto;
    background: var(--light);
    transition: 0.5s;
    z-index: 999;
    padding: 0.5rem 1.5rem 0 0;
    gap: 32px;

    .account-info {
      gap: 20px;
      padding-left: 24px;
    }

    .account-nav {
      flex-direction: column;
      width: 100%;
      padding-left: 0;
      margin-bottom: 0;
    }
  }

  .sidebar.open {
    margin-left: 0;
  }

  .content {
    margin-left: 0;
    background: #ffffff;
    transition: 0.5s;

    .navbar {
      justify-content: space-between;
      background-color: #f3f6f9;
      padding: 12px 1.5rem;
      position: sticky;
      top: 0;
      z-index: 1000;

      .sidebar-toggler {
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: #fff;
        border-radius: 50%;

        a {
          color: #009fda;
        }
      }
    }

    .page-render {
      width: 100%;
      padding-right: 1.5rem;
      padding-left: 1.5rem;
      padding-top: 1.5rem;
    }
  }

  .content.expand {
    margin-left: 250px;
  }
`;

export const NavLink = styled.a`
  padding: 8px 24px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 0 30px 30px 0;

  background-color: ${(props) => (props.$selected ? "#fff" : "#f3f6f9")};
  color: ${(props) => (props.$selected ? "#009FDA" : "#303030")};
  border-left: ${(props) =>
    props.$selected ? "3px solid #009FDA" : "3px solid transparent"};
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-left 0.3s ease;

  .nav-icon {
    border-radius: 50%;
    background-color: #fff;
    transition: background-color 0.3s ease;
  }

  ${(props) =>
    props.$selected &&
    `
    .nav-icon {
      background-color: #f3f6f9; 
    }
  `}

  &:hover {
    background-color: #fff;
    color: #009fda;
    border-left: 3px solid #009fda;

    .nav-icon {
      background-color: #f3f6f9;
    }
  }
`;

export const ImageContainer = styled(Box)`
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  .rounded-circle {
    border-radius: 50%;
    background-color: #198754;
    padding: 0.25rem;
    position: absolute;
    right: 0;
    bottom: 0;
    border: 1px solid #dee2e6;
  }
`;

export const Avatar = styled(Image)`
  object-fit: cover;
  object-position: center center;
  border-radius: 50%;
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
