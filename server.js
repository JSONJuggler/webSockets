const express = require("express");
const socket = require("socket.io");

const app = express();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

const io = socket(server);

io.on("connect", function(socket) {
  console.log("made socket connection");

  socket.on("chat", function(data) {
    io.emit("chat", data);

    console.log("received chat event");
  });

  socket.on("removeFeedback", function(data) {
    socket.broadcast.emit("removeFeedback", data);
  });
  socket.on("disconnect", function(data) {
    console.log("user disconnected");
  });
  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
    console.log("received typing event");
  });
});
