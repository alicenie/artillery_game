import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:8080");

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [isTurn, setIsTurn] = useState(false);
  const [side, setSide] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const handleSendMessage = () => {
    socket.emit("send_message", { message, room });
    setIsTurn(!isTurn);
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
      <input
        placeholder="message here..."
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button onClick={handleSendMessage} disabled={!isTurn}>
        Send Message
      </button>
      <p>Message received: {messageReceived}</p>
    </div>
  );
}

export default App;
