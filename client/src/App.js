import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Projectile from "./components/Projectile";
import Input from "./components/Input";
import { Button } from "@mui/material";

const socket = io.connect("http://localhost:8080");

function App() {
  const [speed, setSpeed] = useState(100);
  const [angle, setAngle] = useState(45);
  const [cannonAngles, setCannonAngles] = useState({ left: 45, right: 45 });
  const [room, setRoom] = useState("");
  const [isTurn, setIsTurn] = useState(false);
  const [side, setSide] = useState("");
  const [projectileSide, setProjectileSide] = useState("");
  const [projectileSpeed, setProjectileSpeed] = useState(100);
  const [showProjectile, setShowProjectile] = useState(false);
  const [messageReceived, setMessageReceived] = useState("");

  const handleSendMessage = () => {
    socket.emit("send_message", { speed, room });
    setIsTurn(!isTurn);
  };

  const handleSpeedChange = (speed) => {
    setSpeed(speed);
  };

  const handleAngleChange = (angle) => {
    setAngle(angle);
    let tempCannonAngles = cannonAngles;
    tempCannonAngles[side] = angle;
    setCannonAngles(tempCannonAngles);
    socket.emit("rotate_cannon", { angle, room, side });
    console.log(tempCannonAngles);
  };

  const handleFire = () => {
    // draw flying projectile
    setProjectileSide(side);
    setProjectileSpeed(speed);
    setShowProjectile(true);
    // check win --> server

    // send to server
    socket.emit("fire", { speed, angle, room, side });
    setIsTurn(!isTurn);
  };

  const endProjectile = () => {
    setShowProjectile(false);
  };

  // only called once, on mount
  useEffect(() => {
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
      setProjectileSide(data.side);
      console.log("start game: ", data.isTurn, data.side);
    });

    socket.on("show_projectile", (data) => {
      setProjectileSpeed(data.speed);
      setProjectileSide(data.side);
      setShowProjectile(true);
      setIsTurn(!isTurn);
    });

    socket.on("update_cannon", (data) => {
      console.log("updata cannon", data);
      let tempCannonAngles = cannonAngles;
      tempCannonAngles[data.side] = data.angle;
      console.log(tempCannonAngles);
      setCannonAngles(tempCannonAngles);
    });
  }, [socket]);

  return (
    <div className="App">
      <Projectile
        speed={projectileSpeed}
        leftAngle={cannonAngles.left}
        rightAngle={cannonAngles.right}
        side={projectileSide}
        showProjectile={showProjectile}
        endProjectile={endProjectile}
      />
      <Input
        onSpeedChange={handleSpeedChange}
        onAngleChange={handleAngleChange}
        speed={speed}
        angle={angle}
      />
      <Button onClick={handleFire} disabled={!isTurn}>
        Fire
      </Button>
      {/* <p>Message received: {messageReceived}</p> */}
    </div>
  );
}

export default App;
