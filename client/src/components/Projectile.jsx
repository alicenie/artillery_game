import { useState, useEffect, useRef } from "react";

const Projectile = () => {
  const [position, setPosition] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    console.log(canvas.height);
    const context = canvas.getContext("2d");
    let frameId;
    let time = 0;

    function draw() {
      // calculate new position based on time and velocity
      const velocity = 50; // pixels per second
      const gravity = 9.81; // m/s^2
      const radians = Math.PI / 4;
      const x = velocity * Math.cos(radians) * time;
      //   console.log(x);
      const y =
        canvas.height -
        velocity * Math.sin(radians) * time +
        0.5 * gravity * Math.pow(time, 2);
      //   console.log(y);

      // draw ball at new position
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.arc(x, y, 5, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();

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
  }, []);

  function animationFinished() {
    console.log("Animation finished");
    // call your other method here
    myOtherMethod();
  }

  function myOtherMethod() {
    console.log("My other method");
    // do something else here
  }

  return <canvas ref={canvasRef} width={800} height={400} />;
};

export default Projectile;
