const express = require("express");
const socket = require("socket.io");

const app = express();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

const io = socket(server);

io.on("connect", function (socket) {
  console.log("made socket connection");

  socket.on("chat", function (data) {
    socket.broadcast.emit("chat", data);
    console.log("received chat event");
  });

  socket.on("removeFeedback", function (data, callback) {
    socket.broadcast.emit("removeFeedback", data);
    callback("removing feedback");
  });
  socket.on("disconnect", function (data) {
    console.log("user disconnected");
  });
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
    console.log("received typing event");
  });
});

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "client", "build")));

  // Serve index.html on all routes except the api routes above
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
