import { Box } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";

const CountdownTimer = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []); // chỉ chạy 1 lần khi mounted

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <Box
      style={{ backgroundColor: "rgba(204, 208, 235, 0.5)" }}
      borderRadius={20}
      p={6}
    >
      <span style={{ color: "#fff", fontSize: "34px", fontWeight: "600" }}>
        {formatTime(timeLeft)}
      </span>
    </Box>
  );
};

export default CountdownTimer;
