import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Projectile from "./components/Projectile";
import Input from "./components/Input";

const socket = io.connect("http://localhost:8080");

function App() {
  const [speed, setSpeed] = useState(10);
  const [angle, setAngle] = useState(45);
  const [room, setRoom] = useState("");
  const [isTurn, setIsTurn] = useState(false);
  const [side, setSide] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const handleSendMessage = () => {
    socket.emit("send_message", { speed, room });
    setIsTurn(!isTurn);
  };

  const handleSpeedChange = (speed) => {
    setSpeed(speed);
    console.log(speed);
  };

  const handleAngleChange = (angle) => {
    setAngle(angle);
    console.log(angle);
  };

  // only join the room once, on mount
  useEffect(() => {
    console.log("useEffect");
    socket.on("connect", () => {
      console.log("client connect to socket");
      // socket.emit("join_room");
    });
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data);
      setIsTurn(!isTurn);
    });

    socket.on("joined_room", (room) => {
      console.log("joined room", room);
      setRoom(room);
    });

    socket.on("start_game", (data) => {
      setIsTurn(data.isTurn);
      setSide(data.side);
      console.log("start game: ", data.isTurn, data.side);
    });
  }, [socket]);

  return (
    <div className="App">
      <Projectile speed={speed} />
      <Input
        onSpeedChange={handleSpeedChange}
        onAngleChange={handleAngleChange}
        speed={speed}
        angle={angle}
      />
      <button onClick={handleSendMessage} disabled={!isTurn}>
        Fire
      </button>
      <p>Message received: {messageReceived}</p>
    </div>
  );
}

export default App;
