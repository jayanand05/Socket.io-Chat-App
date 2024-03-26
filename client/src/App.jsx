import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);

  const socket = io("http://localhost:8005");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("received-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    socket.on("Welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="div" gutterBottom>
        Welcome to Chat Room
      </Typography>

      <Typography component="div" gutterBottom style={{ marginLeft: "20px" }}>
        <b>Room Id:</b> {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic1"
          label="Room Id"
          variant="outlined"
          style={{ margin: "20px", width: "300px" }}
        />
        <br />
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic2"
          label="Message"
          variant="outlined"
          style={{ marginLeft: "20px", width: "300px" }}
        />
        <br />
        <Button
          style={{ margin: "20px" }}
          type="submit"
          variant="contained"
          color="primary"
        >
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((m, i) => (
          <Typography
            key={i}
            variant="h6"
            component="div"
            gutterBottom
            style={{ marginLeft: "20px" }}
          >
            <b>Received Msg:</b> {m}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
