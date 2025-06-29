import React, { useState, useEffect, useRef } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import styled from "styled-components";

const ListItem = styled.li.attrs(() => ({}))`
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected ? "#e0f7fa" : "transparent"};
  color: ${(props) => (props.$isSelected ? "#303030" : "626461")};

  &:hover {
    background-color: #dcf4ff;
    color: #303030;
    transition: background-color 0.3s ease;
  }
`;

export const ComboBox = ({
  label,
  placeholder,
  items,
  value,
  onChange,
  width = "50%",
  height = "48px",
  borderRadius = "20px",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (item) => {
    setSelectedValue(item);
    onChange(item);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      isOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{ position: "relative", width }} ref={dropdownRef}>
      {label && <label>{label}</label>}
      <Flex
        onClick={toggleDropdown}
        alignItems="center"
        justifyContent="space-between"
        style={{
          border: isOpen ? "1px solid #009FDA" : "1px solid #c4c4c4",
          boxShadow: isOpen ? "0 0 0 0.15rem rgba(0, 156, 255, 0.25)" : "none",
          padding: "8px",
          cursor: "pointer",
          borderRadius: borderRadius,
          height: height,
          backgroundColor: "#fff",
          transition: "all 0.3s ease",
          color: "#303030",
        }}
      >
        {selectedValue?.label ?? (
          <span style={{ color: "#626461" }}>{placeholder}</span>
        )}

        <Box ml="20px">
          <LuChevronDown />
        </Box>
      </Flex>
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            top: "110%",
            left: "0",
            width: "100%",
            margin: 0,
            padding: "12px 0",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: borderRadius,
            maxHeight: "140px",
            overflowY: "auto",
            zIndex: 1,
          }}
        >
          {items.map((item) => (
            <ListItem
              key={item.value}
              onClick={() => handleSelect(item)}
              $isSelected={selectedValue?.value === item.value}
            >
              {item.label}
            </ListItem>
          ))}
        </ul>
      )}
    </div>
  );
};
