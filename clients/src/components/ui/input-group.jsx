import { Group, InputElement, Input } from "@chakra-ui/react";
import * as React from "react";
// import { StyledInput } from "./StyledInput"; // Đường dẫn import
import styled from "styled-components";

const StyledInput = styled(Input)`
  border-radius: ${(props) => props.$borderRadius || "20px"};
  height: ${(props) => props.$height || "48px"};
  width: ${(props) => props.$width || "100%"};

  font-size: 15px;
  background-color: #fff;
  color: #303030;
  border-color: #cdcdcd;

  &:focus {
    outline: 1px solid #009fda;
    border: none;
    box-shadow: 0 0 0 0.15rem rgba(0, 156, 255, 0.25);
  }
`;

export const InputGroup = React.forwardRef(function InputGroup(props, ref) {
  const {
    startElement,
    startElementProps,
    endElement,
    endElementProps,
    children,
    startOffset = "0px",
    endOffset = "6px",
    height = "48px",
    width = "100%",
    borderRadius = "20px",
    ...rest
  } = props;

  return (
    <Group ref={ref} {...rest}>
      {startElement && (
        <InputElement pointerEvents="none" {...startElementProps}>
          {startElement}
        </InputElement>
      )}

      <StyledInput
        {...children.props}
        ref={children.ref}
        $height={height}
        $width={width}
        $borderRadius={borderRadius}
        {...(startElement && { ps: `calc(2.5em + ${startOffset})` })}
        {...(endElement && { pe: `calc(2.5em + ${endOffset})` })}
      />

      {endElement && (
        <InputElement placement="end" {...endElementProps}>
          {endElement}
        </InputElement>
      )}
    </Group>
  );
});
