import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Projectile from "./components/Projectile";
import Input from "./components/Input";
import Result from "./components/Result";
import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import EastIcon from "@mui/icons-material/East";
import WestIcon from "@mui/icons-material/West";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#0075a2",
      contrastText: "fff",
    },
    error: {
      main: "#cd5334",
      contrastText: "#fff",
    },
  },
});

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

  useEffect(() => {
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

  const Item = styled(Box)(({ theme }) => ({
    backgroundColor: "#0075a2",
    padding: theme.spacing(2),
    borderRadius: 20,
    height: "50%",
    width: "90%",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: "100vh", backgroundColor: "#f2f4f3" }}>
        {isWinner !== null && <Result isWinner={isWinner}></Result>}
        <Typography variant="h5" gutterBottom align="center" padding={1}>
          Artillery Game
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={3}>
            <Item>
              <Typography variant="body1">
                Wind: {wind ? Math.abs(wind) + "m/s" : ""}
              </Typography>
              {wind && (wind > 0 ? <EastIcon /> : <WestIcon />)}
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item>
              <Typography variant="body1">
                {side == ""
                  ? "Wait for your opponent to join..."
                  : isTurn
                  ? "It's your turn!"
                  : "It's your opponent's turn!"}
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <Typography variant="body1">
                Distance to opposing cannon: {dist ? dist + "m" : ""}
              </Typography>
            </Item>
          </Grid>
        </Grid>

        <Input
          onSpeedChange={handleSpeedChange}
          onAngleChange={handleAngleChange}
          onFire={handleFire}
          speed={speed}
          angle={angle}
          isTurn={isTurn}
        />

        <Projectile
          speed={projectileSpeed}
          leftAngle={cannonAngles.left}
          rightAngle={cannonAngles.right}
          side={projectileSide}
          wind={wind}
          showProjectile={showProjectile}
          endProjectile={endProjectile}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
