import { useState, useEffect, useRef } from "react";

// the ratio of real distance (meters) and screen length (px)
const ratio = 0.5;
const canvas_width = 2000 * ratio;
const canvas_height = 1000 * ratio;
const left_cannon = 500 * ratio;
const right_cannon = 1500 * ratio;

const Projectile = ({
  leftAngle,
  rightAngle,
  speed,
  side,
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
      endProjectile();
    }
  }, [showProjectile]);

  const fire = () => {
    const canvas = anCanvasRef.current;
    const ctx = canvas.getContext("2d");
    let frameId;
    let time = 0;

    function draw() {
      // calculate new position based on time and velocity
      const velocity = speed * ratio; // pixels per second
      const gravity = 10 * ratio; // m/s^2
      const radians =
        ((side === "left" ? leftAngle : rightAngle) * Math.PI) / 180;
      let x;
      if (side === "left")
        x = velocity * Math.cos(radians) * time + left_cannon;
      else x = right_cannon - velocity * Math.cos(radians) * time;
      const y =
        canvas.height -
        velocity * Math.sin(radians) * time +
        0.5 * gravity * Math.pow(time, 2);

      // draw ball at new position
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      // update time and check if animation is finished
      time += 0.1;
      if (y <= 0) {
        cancelAnimationFrame(frameId);
        animationFinished();
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

  const animationFinished = () => {
    console.log("Animation finished");
    // call your other method here
    myOtherMethod();
  };

  const myOtherMethod = () => {
    console.log("My other method");
    // do something else here
  };

  const drawCannon = ({ leftAngle, rightAngle }) => {
    console.log("draw cannon", { leftAngle, rightAngle });
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext("2d");
    // clear canvas
    ctx.clearRect(0, 0, canvas_width, canvas_height);

    // set the border color and thickness
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;

    // draw the border
    ctx.strokeRect(0, 0, canvas_width, canvas_height);

    // draw left cannon
    ctx.save();
    ctx.translate(left_cannon, canvas_height);
    // if (props.side === "left")
    ctx.rotate(((90 - leftAngle) * Math.PI) / 180);
    ctx.fillStyle = "#555";
    ctx.fillRect(-25, -25, 50, 50);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -75);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#555";
    ctx.stroke();
    ctx.restore();

    // draw right cannon
    ctx.save();
    ctx.translate(right_cannon, canvas_height);
    // if (props.side === "right")
    ctx.rotate((-(90 - rightAngle) * Math.PI) / 180);
    ctx.fillStyle = "#555";
    ctx.fillRect(-25, -25, 50, 50);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -75);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#555";
    ctx.stroke();
    ctx.restore();
  };

  return (
    <div>
      <canvas ref={bgCanvasRef} width={canvas_width} height={canvas_height} />
      <canvas
        ref={anCanvasRef}
        width={canvas_width}
        height={canvas_height}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default Projectile;
