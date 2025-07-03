const { Server } = require("socket.io");
const { initSocketEvents } = require("./socketManager");
const { setIO } = require("./ioInstance");

const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  setIO(io);
  initSocketEvents(io);
};

module.exports = setupSocketIO;
