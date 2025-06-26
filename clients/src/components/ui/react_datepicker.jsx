import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Flex, Box, Input, Icon } from "@chakra-ui/react";
import { FaRegCalendarAlt } from "react-icons/fa";

import "./style.css";

const CustomInput = forwardRef(
  (
    {
      value,
      onClick,
      height = "48px",
      fontSize = "15px",
      padding = "8px",
      borderRadius = "20px",
    },
    ref
  ) => (
    <Flex
      justifyContent="space-between"
      backgroundColor="#fff"
      alignItems="center"
      position="relative"
      height={height}
      width="230px"
      border="1px solid #c4c4c4"
      borderRadius={borderRadius}
    >
      <Input
        style={{ height: height, borderRadius: borderRadius }}
        value={value}
        onClick={onClick}
        readOnly
        ref={ref}
        placeholder="Tất cả các ngày"
        fontSize={fontSize}
        color="#626461"
        padding={padding}
        _hover={{ borderColor: "#009FDA" }}
        _placeholder={{
          color: "#626461",
          fontWeight: "normal",
          fontSize: fontSize,
        }}
      />

      <Icon
        as={FaRegCalendarAlt}
        position="absolute"
        right="10px"
        top="50%"
        transform="translateY(-50%)"
        color="#626461"
        cursor="pointer"
        onClick={onClick}
      />
    </Flex>
  )
);

export const CustomDateRangePicker = ({
  height,
  fontSize,
  padding,
  borderRadius,
  dateRange,
  setDateRange,
}) => {
  const [startDate, endDate] = dateRange || [null, null];

  const customInput = (
    <CustomInput
      height={height}
      fontSize={fontSize}
      padding={padding}
      borderRadius={borderRadius}
    />
  );

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <DatePicker
        selected={startDate}
        onChange={(update) => setDateRange(update || [null, null])}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        dateFormat="dd/MM/yyyy"
        customInput={customInput}
      />
    </Box>
  );
};
