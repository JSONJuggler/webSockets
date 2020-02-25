import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";
import _ from "underscore";

export default function Landing() {
  const [currentSocket, setCurrentSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setCurrentSocket(socket);
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const [yourKey, setYourKey] = useState("");

  const [formData, setFormData] = useState({
    handle: "",
    message: ""
  });

  // const [recieving, setReceiving] = useState(false);
  const [feedback, setFeedback] = useState([]);

  if (currentSocket) {
    const handleHandle = e => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChange = e => {
      // console.log(e.target.name);
      // console.log(e.target.value);
      currentSocket.emit("typing", {
        handle: formData.handle,
        id: currentSocket.id
      });
      setYourKey(currentSocket.id);
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClick = e => {
      currentSocket.emit("chat", {
        handle: formData.handle,
        message: formData.message
      });
      currentSocket.emit("removeFeedback", { key: yourKey });
    };
    currentSocket.on("typing", function(data) {
      // setReceiving(true);
      // console.log(data);
      setFeedback(prevFeedback => {
        if (_.findWhere(prevFeedback, { key: data.id })) {
          return prevFeedback;
        } else {
          return [
            ...prevFeedback,
            <p key={data.id}>
              <em>{data.handle} is typing </em>
            </p>
          ];
        }
      });
    });

    currentSocket.on("removeFeedback", function(data) {
      setFeedback(prevFeedback => [
        _.filter(prevFeedback, fb => {
          return !_.isMatch(fb, { key: data.key });
        })
      ]);
    });
    return (
      <div id="mario-chat">
        <div id="chat-window">
          <div id="output"></div>
          <div id="feedback">{feedback}</div>
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
        <button id="send" onClick={e => handleClick(e)}>
          Send
        </button>
      </div>
    );
  } else {
    return <Fragment>Problem connecting to server</Fragment>;
  }
}
