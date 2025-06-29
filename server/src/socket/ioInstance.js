let ioInstance = null;

const setIO = (io) => {
  ioInstance = io;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("⚠️ Socket.IO instance chưa được khởi tạo");
  }
  return ioInstance;
};

module.exports = { setIO, getIO };
