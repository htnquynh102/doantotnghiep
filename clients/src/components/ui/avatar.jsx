import { Flex } from "@chakra-ui/react";
import * as React from "react";
import rabbit from "../../assets/images/rabbit.png";

export const Avatar = React.forwardRef(function Avatar(props, ref) {
  const { name, src, ...rest } = props;
  const finalSrc = src && src.trim() !== "" ? src : rabbit;
  const displayName = name && name.trim() !== "" ? name : "Đăng nhập | Đăng ký";
  return (
    <Flex
      ref={ref}
      {...rest}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
    >
      <img
        src={finalSrc}
        style={{ width: "24px", height: "24px", borderRadius: "50%" }}
      />
      <div
        style={{
          marginLeft: "10px",
          color: "#009FDA",
          fontWeight: "600",
        }}
      >
        {displayName}
      </div>
    </Flex>
  );
});
