import { useEffect } from "react";
import socket from "../../socket";
import { useAuth } from "../../hooks/useAccount";

const SocketSetup = () => {
  const { accountId } = useAuth();
  console.log(">> Account ID trong SocketSetup:", accountId);

  useEffect(() => {
    if (accountId) {
      console.log("Đăng ký socket với tài khoản:", accountId);
      socket.emit("register", accountId);
      console.log("Socket connected:", socket.connected);
    }

    return () => {
      socket.off("register");
    };
  }, [accountId]);

  console.log("📦 SocketSetup component mounted");

  return null;
};

export default SocketSetup;
