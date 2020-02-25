const socket = io("http://localhost:5000");

const message = document.getElementById("message");
const handle = document.getElementById("handle");
const btn = document.getElementById("send");
const output = document.getElementById("output");
const feedback = document.getElementById("feedback");

btn.addEventListener("click", function() {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value
  });
});

message.addEventListener("keypress", function() {
  socket.emit("typing", handle.value);
});

socket.on("chat", function(data) {
  feedback.innerHTML = "";
  output.innerHTML +=
    "<p><strong>" + data.handle + ":</strong>" + data.message + "</p>";
});

socket.on("typing", function(data) {
  feedback.innerHTML = "<p><em>" + data + "is typing a message...</em></p>";
});
