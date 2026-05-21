const http = require('http');
const app = require('./app');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Import the socket server logic from server.js
const socketServer = require('./server');
socketServer(io);

const PORT = process.env.PORT || 9001;
server.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});
