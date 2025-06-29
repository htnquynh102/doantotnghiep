const connectedUsers = new Map();
const { getIO } = require("./ioInstance");

const initSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("register", (maTaiKhoan) => {
      connectedUsers.set(maTaiKhoan, socket.id);
      console.log(`🟢 ${maTaiKhoan} đã đăng nhập socket: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [maTK, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(maTK);
          console.log(`🔴 ${maTK} đã ngắt kết nối`);
          break;
        }
      }
    });
  });
};

const sendRealtimeNotification = (maTaiKhoan, data) => {
  const io = getIO();
  const socketId = connectedUsers.get(maTaiKhoan);
  if (io && socketId) {
    io.to(socketId).emit("new_notification", data);
    console.log("📡 Gửi notification tới", maTaiKhoan, data);
  } else {
    console.log("⚠️ Không tìm thấy socketId của", maTaiKhoan);
  }
};

module.exports = {
  initSocketEvents,
  sendRealtimeNotification,
};
