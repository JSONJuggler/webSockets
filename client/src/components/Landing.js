import React, { useState, useEffect, Fragment } from "react";
import io from "socket.io-client";
import _ from "underscore";
import { v4 as uuidv4 } from "uuid";

export default function Landing() {
  const [currentSocket, setCurrentSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setCurrentSocket(socket);
    return () => {
      socket.disconnect();
      console.log("unmounting");
    };
  }, []);

  useEffect(() => {
    if (currentSocket) {
      currentSocket.on("chat", function(data) {
        setChat(prevChat => [
          ...prevChat,
          <p key={data.messageId}>
            <strong>{data.handle}:</strong>
            {data.message}
          </p>
        ]);
      });

      currentSocket.on("typing", function(data) {
        setFeedback(prevFeedback => {
          const duplicateKeyCheck = _.findWhere(prevFeedback, {
            key: data.currentSocketId
          });
          if (duplicateKeyCheck) {
            const newFeedback = (
              <p key={data.currentSocketId} name={data.handle}>
                <em>{data.handle} is typing </em>
              </p>
            );
            if (duplicateKeyCheck.props.name === newFeedback.props.name) {
              return prevFeedback;
            } else {
              return [
                ..._.filter(prevFeedback, fb => {
                  return !_.isMatch(fb, { key: data.currentSocketId });
                }),
                newFeedback
              ];
            }
          } else {
            return [
              ...prevFeedback,
              <p key={data.currentSocketId} name={data.handle}>
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
    }
  }, [currentSocket]);

  const [formData, setFormData] = useState({
    handle: "",
    message: ""
  });

  const [yourKey, setYourKey] = useState("");

  const [chat, setChat] = useState([]);

  const [feedback, setFeedback] = useState([]);

  if (currentSocket) {
    const handleHandle = e => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChange = e => {
      currentSocket.emit("typing", {
        handle: formData.handle,
        currentSocketId: currentSocket.id
      });
      setYourKey(currentSocket.id);
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClick = e => {
      setFormData(prevFormData => {
        return { ...prevFormData, message: "" };
      });

      currentSocket.emit("chat", {
        handle: formData.handle,
        message: formData.message,
        messageId: uuidv4()
      });
      currentSocket.emit("removeFeedback", { key: yourKey });
    };

    return (
      <div id="mario-chat">
        <div id="chat-window">
          <div id="output">{chat}</div>
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
          value={formData.message}
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
