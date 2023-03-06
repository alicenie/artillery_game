import { useState, useEffect, useRef } from "react";

// the ratio of real distance (meters) and screen length (px)
const ratio = 0.5;
const canvas_width = 2000 * ratio;
const canvas_height = 1000 * ratio;
const buffer = 10;
const left_cannon = 500 * ratio;
const right_cannon = 1500 * ratio;

// environment and projectile constants
const gravity = 10; // gravity in m/s^2
const rho_air = 1; // density of air in kg/m^3
// const mu_air = 1.8e-5; // dynamic viscosity of air in Pa*s
const d = 0.1; // diameter of projectile in meters
const m = 1; // weight of projectile in kg
const A = Math.PI * Math.pow(d / 2, 2); // Calculate cross-sectional area of projectile

// calculate air resistance
const airResistance = (v) => {
  //   const Re = (rho_air * v * d) / mu_air;
  const Cd = 0.47; // coefficient of drag for a sphere
  const F_drag = 0.5 * rho_air * Math.pow(v, 2) * A * Cd;
  return F_drag;
};

const Projectile = ({
  leftAngle,
  rightAngle,
  speed,
  side,
  wind,
  showProjectile,
  endProjectile,
}) => {
  const bgCanvasRef = useRef(null);
  const anCanvasRef = useRef(null);

  useEffect(() => {
    drawCannon({ leftAngle, rightAngle });
  }, []);

  useEffect(() => {
    drawCannon({ leftAngle, rightAngle });
    console.log({ leftAngle, rightAngle });
  }, [leftAngle, rightAngle]);

  useEffect(() => {
    if (showProjectile) {
      fire();
      console.log(side);
      //   endProjectile();
    }
  }, [showProjectile]);

  const fire = () => {
    const canvas = anCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const v0 = speed * ratio; // pixels per second
    const radians =
      ((side === "left" ? leftAngle : rightAngle) * Math.PI) / 180;
    const vx0 =
      side === "left" ? v0 * Math.cos(radians) : -v0 * Math.cos(radians); // initial projectile speed on x
    const vy0 = v0 * Math.sin(radians); // initial projectile speed on y
    const dt = 0.1; // time step in seconds
    let frameId;
    let vx = vx0;
    let vy = vy0;
    let x = side === "left" ? left_cannon : right_cannon; // initial x position in meters
    let y = canvas_height; // initial y position in meters

    function draw() {
      // calculate the force on projectile
      const v = Math.sqrt(Math.pow(vx - wind, 2) + Math.pow(vy, 2));
      const F_drag = airResistance(v);
      const F_net_x = (-F_drag * (vx - wind)) / v;
      const F_net_y = -m * gravity - (F_drag * vy) / v;
      // Calculate acceleration of projectile
      const ax = F_net_x / m;
      const ay = F_net_y / m;

      // Update position and velocity of sphere
      x += vx * dt;
      y += -vy * dt;
      vx += ax * dt;
      vy += ay * dt;

      //   let x;
      //   if (side === "left") x = v0 * Math.cos(radians) * time + left_cannon;
      //   else x = right_cannon - v0 * Math.cos(radians) * time;
      //   const y =
      //     canvas_height -
      //     v0 * Math.sin(radians) * time +
      //     0.5 * gravity * Math.pow(time, 2);

      // draw ball at new position
      ctx.clearRect(0, 0, canvas_width, canvas_height + buffer);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      // update time and check if animation is finished
      //   time += 0.1;
      if (y < 0 || y > canvas_height || x > canvas_width || x < 0) {
        cancelAnimationFrame(frameId);
        // calculate distance to the opposing player's cannon
        let dist = null;
        if (y > canvas_height) {
          dist = side === "left" ? right_cannon - x : x - left_cannon;
        }
        animationFinished(dist, side);
      } else {
        frameId = requestAnimationFrame(draw);
      }
    }

    frameId = requestAnimationFrame(draw);

    // clean up the animation frame when the component unmounts
    return () => {
      cancelAnimationFrame(frameId);
    };
  };

  const animationFinished = (dist, side) => {
    console.log("Animation finished");
    endProjectile(dist, side);
  };

  const drawCannon = ({ leftAngle, rightAngle }) => {
    console.log("draw cannon", { leftAngle, rightAngle });
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext("2d");
    // clear canvas
    ctx.clearRect(0, 0, canvas_width, canvas_height + buffer);

    // set the border color and thickness
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;

    // draw the border
    ctx.strokeRect(0, 0, canvas_width, canvas_height + buffer);

    // draw left cannon
    ctx.save();
    ctx.translate(left_cannon, canvas_height + buffer);
    // if (props.side === "left")
    ctx.rotate(((90 - leftAngle) * Math.PI) / 180);
    ctx.fillStyle = "#555";
    ctx.fillRect(-10, -10, 20, 20);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -40);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#555";
    ctx.stroke();
    ctx.restore();

    // draw right cannon
    ctx.save();
    ctx.translate(right_cannon, canvas_height + buffer);
    // if (props.side === "right")
    ctx.rotate((-(90 - rightAngle) * Math.PI) / 180);
    ctx.fillStyle = "#555";
    ctx.fillRect(-10, -10, 20, 20);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -40);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#555";
    ctx.stroke();
    ctx.restore();
  };

  return (
    <div style={{ margin: "0 auto" }}>
      <canvas
        ref={bgCanvasRef}
        width={canvas_width}
        height={canvas_height + buffer}
        style={{ position: "absolute", top: "30%", left: "15%" }}
      />
      <canvas
        ref={anCanvasRef}
        width={canvas_width}
        height={canvas_height + buffer}
        style={{ position: "absolute", top: "30%", left: "15%" }}
      />
    </div>
  );
};

export default Projectile;
