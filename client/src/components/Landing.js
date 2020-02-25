import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";

export default function Landing() {
  const [currentSocket, setCurrentSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setCurrentSocket(socket);
    // return () => {
    //   socket.disconnect();
    // };
    console.log(currentSocket);
  }, []);

  const [formData, setFormData] = useState({
    handle: "",
    message: ""
  });

  const [recieving, setReceiving] = useState(false);
  const [feedback, setFeedback] = useState([]);

  if (currentSocket) {
    const handleHandle = e => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChange = e => {
      // console.log(e.target.name);
      // console.log(e.target.value);
      currentSocket.emit("typing", formData.handle);
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    currentSocket.on("typing", function(data) {
      setReceiving(true);
      setFeedback(
        <p>
          <em>{data} is typing </em>
        </p>
      );
    });
    return (
      <div id="mario-chat">
        <div id="chat-window">
          <div id="output"></div>
          {recieving && <div id="feedback">{feedback}</div>}
        </div>
        <input
          id="handle"
          name={"handle"}
          type="text"
          placeholder="Handle"
          onChange={e => handleHandle(e)}
        />
        <input
          id="message"
          name={"message"}
          type="text"
          placeholder="Message"
          onChange={e => handleChange(e)}
        />
        <button id="send">Send</button>
      </div>
    );
  } else {
    return <Fragment>Problem connecting to server</Fragment>;
  }
}
