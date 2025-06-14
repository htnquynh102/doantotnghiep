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

// import React, { useState, forwardRef } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { Flex, Box, Input, Icon, Button, Text } from "@chakra-ui/react";
// import { FaRegCalendarAlt } from "react-icons/fa";
// import "./style.css";

// const formatDate = (date) =>
//   date ? new Date(date).toLocaleDateString("vi-VN") : "";

// const CustomInput = forwardRef(
//   (
//     {
//       value,
//       onClick,
//       height,
//       fontSize = "15px",
//       padding = "8px",
//       borderRadius = "20px",
//     },
//     ref
//   ) => (
//     <Flex
//       justifyContent="space-between"
//       backgroundColor="#fff"
//       alignItems="center"
//       position="relative"
//       height={height}
//       width="230px"
//       border="1px solid #c4c4c4"
//       borderRadius={borderRadius}
//       _focusWithin={{
//         boxShadow: "0 0 0 0.15rem rgba(0, 156, 255, 0.25)",
//         borderColor: "#009fda",
//       }}
//     >
//       <Input
//         value={value}
//         onClick={onClick}
//         readOnly
//         ref={ref}
//         placeholder="Tất cả các ngày"
//         border="none"
//         fontSize={fontSize}
//         color="#626461"
//         width="100%"
//         height="100%"
//         padding={padding}
//         _hover={{ borderColor: "#009FDA" }}
//         _placeholder={{
//           color: "#626461",
//           fontWeight: "normal",
//           fontSize: fontSize,
//         }}
//       />
//       <Icon
//         as={FaRegCalendarAlt}
//         position="absolute"
//         right="10px"
//         top="50%"
//         transform="translateY(-50%)"
//         color="#626461"
//         cursor="pointer"
//         onClick={onClick}
//       />
//     </Flex>
//   )
// );

// export const CustomDateRangePicker = ({
//   height = "48px",
//   fontSize = "15px",
//   padding = "8px",
//   borderRadius = "20px",
//   dateRange,
//   setDateRange,
// }) => {
//   const [open, setOpen] = useState(false);
//   const [tempRange, setTempRange] = useState(dateRange || [null, null]);
//   const [startDate, endDate] = tempRange;

//   const applyDateRange = () => {
//     setDateRange(tempRange);
//     setOpen(false);
//   };

//   const resetDateRange = () => {
//     setTempRange([null, null]);
//     setDateRange([null, null]);
//     setOpen(false);
//   };

//   return (
//     <Box>
//       <DatePicker
//         open={open}
//         onClickOutside={() => setOpen(false)}
//         onInputClick={() => setOpen(true)}
//         selectsRange
//         startDate={startDate}
//         endDate={endDate}
//         onChange={(update) => setTempRange(update || [null, null])}
//         dateFormat="dd/MM/yyyy"
//         customInput={
//           <CustomInput
//             height={height}
//             fontSize={fontSize}
//             padding={padding}
//             borderRadius={borderRadius}
//           />
//         }
//         renderCustomHeader={({
//           date,
//           decreaseMonth,
//           increaseMonth,
//           prevMonthButtonDisabled,
//           nextMonthButtonDisabled,
//         }) => (
//           <>
//             {/* From / To hiển thị phía trên tháng */}
//             <Flex
//               justifyContent="space-between"
//               px={2}
//               py={1}
//               fontSize="sm"
//               color="gray.600"
//               borderBottom="1px solid #e2e8f0"
//             >
//               <Text>From: {formatDate(startDate)}</Text>
//               <Text>To: {formatDate(endDate)}</Text>
//             </Flex>

//             {/* Tiêu đề tháng + nút navigation */}
//             <Flex
//               alignItems="center"
//               justifyContent="space-between"
//               px={2}
//               mt={1}
//             >
//               <Button
//                 onClick={decreaseMonth}
//                 isDisabled={prevMonthButtonDisabled}
//                 size="sm"
//                 variant="ghost"
//               >
//                 {"<"}
//               </Button>
//               <Text fontWeight="bold">
//                 {date.toLocaleString("default", {
//                   month: "long",
//                   year: "numeric",
//                 })}
//               </Text>
//               <Button
//                 onClick={increaseMonth}
//                 isDisabled={nextMonthButtonDisabled}
//                 size="sm"
//                 variant="ghost"
//               >
//                 {">"}
//               </Button>
//             </Flex>
//           </>
//         )}
//       >
//         {/* Footer */}
//         <Flex justifyContent="space-between" mt={3} px={3} pb={2}>
//           <Button size="sm" variant="outline" onClick={resetDateRange}>
//             Thiết lập lại
//           </Button>
//           <Button size="sm" colorScheme="blue" onClick={applyDateRange}>
//             Áp dụng
//           </Button>
//         </Flex>
//       </DatePicker>
//     </Box>
//   );
// };
