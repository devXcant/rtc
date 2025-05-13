import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    // If there is already someone in the room, notify the new peer to be the answerer
    const clients = io.sockets.adapter.rooms.get(room);
    if (clients && clients.size > 1) {
      socket.to(room).emit("ready");
    }
  });

  socket.on("signal", ({ room, ...data }) => {
    // Only send to others in the same room
    socket.to(room).emit("signal", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
