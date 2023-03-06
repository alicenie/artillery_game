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
      // generate a random wind
      const min = 5;
      const max = 30;
      const windMagnitude = Math.floor(Math.random() * (max - min + 1)) + min;
      const windDirection = Math.random() < 0.5 ? -1 : 1; // positive if to right, negative if to left
      const wind = windDirection * windMagnitude;
      // start the game
      socket.emit("start_game", { isTurn: false, side: "right", wind: wind });
      socket
        .to(`room-${roomCounter}`)
        .emit("start_game", { isTurn: true, side: "left", wind: wind });
    } else {
      // Create a new room and add the player to that room
      roomCounter += 1;
      socket.join(`room-${roomCounter}`);
    }
  }
  // console.log("rooms", rooms);

  socket.emit("joined_room", `room-${roomCounter}`);

  socket.on("fire", (data) => {
    socket.to(data.room).emit("show_projectile", {
      speed: data.speed,
      angle: data.angle,
      side: data.side,
    });
  });

  socket.on("rotate_cannon", (data) => {
    console.log("rotate cannon", data);
    socket.to(data.room).emit("update_cannon", {
      angle: data.angle,
      side: data.side,
    });
  });

  socket.on("end_game", (room) => {
    socket.leave(room);
  });
});

server.listen(8080, () => {
  console.log("SERVER IS RUNNING");
});
