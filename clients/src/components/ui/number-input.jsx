import { useState } from "react";
import { Flex, Button, Input } from "@chakra-ui/react";
import { LuPlus, LuMinus } from "react-icons/lu";

export const NumberInput = ({
  min = 0,
  max = 10,
  step = 1,
  value,
  onChange,
  totalSelectedTickets,
  maxEventTickets,
}) => {
  const canIncrease =
    value + step <= max && totalSelectedTickets < maxEventTickets;

  const handleIncrease = () => {
    if (value + step <= max && totalSelectedTickets < maxEventTickets)
      onChange(value + step);
  };

  const handleDecrease = () => {
    if (value - step >= min) onChange(value - step);
  };

  return (
    <Flex alignItems="center" justifyContent="space-between" gap={2}>
      <Button onClick={handleDecrease} className="white-btn">
        <LuMinus />
      </Button>

      <Input
        value={value}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (!isNaN(val) && val >= min && val <= max) {
            onChange(val);
          }
        }}
        textAlign="center"
        w="60px"
        sx={{
          "&::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&": {
            MozAppearance: "textfield", // Firefox
          },
        }}
      />

      <Button
        onClick={handleIncrease}
        isDisabled={!canIncrease}
        className="white-btn"
      >
        <LuPlus />
      </Button>
    </Flex>
  );
};
