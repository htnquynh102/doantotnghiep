import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Kết nối socket.io thành công! ID:", socket.id);
});

export default socket;
