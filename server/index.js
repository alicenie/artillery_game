const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  },
});

let roomCounter = 0;
const playersPerRoom = 2;

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  // join a room
  const rooms = io.sockets.adapter.rooms;
  // get the last room
  const lastRoom = rooms.get(`room-${roomCounter}`);
  if (!lastRoom) {
    // if no room exists, create the first room
    socket.join(`room-${roomCounter}`);
  } else {
    // check if the last room is occupied by two players
    const numPlayers = lastRoom ? lastRoom.size : 0;
    if (numPlayers < playersPerRoom) {
      // Add the player to the last room
      socket.join(`room-${roomCounter}`);
      // start the game
      socket.emit("start_game", { isTurn: false, side: "right" });
      socket
        .to(`room-${roomCounter}`)
        .emit("start_game", { isTurn: true, side: "left" });
    } else {
      // Create a new room and add the player to that room
      roomCounter += 1;
      socket.join(`room-${roomCounter}`);
    }
  }
  console.log("rooms", rooms);

  socket.emit("joined_room", `room-${roomCounter}`);

  socket.on("send_message", (data) => {
    console.log(data.room);
    socket.to(data.room).emit("receive_message", data.message);
  });
});

server.listen(8080, () => {
  console.log("SERVER IS RUNNING");
});
