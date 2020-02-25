import React from "react";
import io from "socket.io-client";

export default function Landing() {
  const socket = io("http://localhost:5000");

  return (
    <div id="mario-chat">
      <div id="chat-window">
        <div id="output"></div>
        <div id="feedback"></div>
      </div>
      <input id="handle" type="text" placeholder="Handle" />
      <input id="message" type="text" placeholder="Message" />
      <button id="send">Send</button>
    </div>
  );
}
