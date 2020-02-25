const express = require("express");
const socket = require("socket.io");

const app = express();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

app.use(express.static("public"));

const io = socket(server);

io.on("connect", function(socket) {
  console.log("made socket connection");

  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });
});
