import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Projectile from "./components/Projectile";
import Input from "./components/Input";
import Result from "./components/Result";
import { Button, Grid, Typography } from "@mui/material";

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
  const [wind, setWind] = useState("");
  const [dist, setDist] = useState("");
  const [isWinner, setIsWinner] = useState(null);
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
  };

  const handleFire = () => {
    // draw flying projectile
    setProjectileSide(side);
    setProjectileSpeed(speed);
    setShowProjectile(true);

    // send to server
    socket.emit("fire", { speed, angle, room, side });
  };

  const endProjectile = (dist, projSide) => {
    setShowProjectile(false);
    setIsTurn(!isTurn);
    if (dist) {
      // check win
      if (Math.abs(dist) <= 3) {
        endGame(projSide == side);
      } else if (dist == 500) {
        // hit itself
        endGame(false);
      }
      // display distance to the opposing cannon
      setDist(Math.abs(dist).toFixed(1));
    }
  };

  const endGame = (win) => {
    setIsWinner(win);
    socket.emit("end_game", room);
  };

  // only called once, on mount
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("client connect to socket");
  //     // socket.emit("join_room");
  //   });
  // }, []);

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
      setWind(data.wind);
      console.log("start game: ", data);
    });

    socket.on("show_projectile", (data) => {
      setProjectileSpeed(data.speed);
      setProjectileSide(data.side);
      setShowProjectile(true);
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
      {isWinner !== null && <Result isWinner={isWinner}></Result>}
      <Typography variant="h5" gutterBottom align="center">
        Artillery Game
      </Typography>
      <Grid container spacing={8} justifyContent="center">
        <Grid item>
          <Typography variant="h6">Wind: {wind} m/s</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            {side == ""
              ? "Wait for your opponent to join..."
              : isTurn
              ? "It's your turn!"
              : "It's your opponent's turn!"}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            Distance to opposing cannon: {dist ? dist + "m" : ""}
          </Typography>
        </Grid>
      </Grid>
      <Input
        onSpeedChange={handleSpeedChange}
        onAngleChange={handleAngleChange}
        speed={speed}
        angle={angle}
      />
      <Button onClick={handleFire} disabled={!isTurn}>
        Fire
      </Button>
      <Projectile
        speed={projectileSpeed}
        leftAngle={cannonAngles.left}
        rightAngle={cannonAngles.right}
        side={projectileSide}
        wind={wind}
        showProjectile={showProjectile}
        endProjectile={endProjectile}
      />
      <br />

      {/* <p>Message received: {messageReceived}</p> */}
    </div>
  );
}

export default App;
