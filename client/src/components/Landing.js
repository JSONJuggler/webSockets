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
      currentSocket.emit("typing", {
        handle: formData.handle,
        id: currentSocket.id
      });
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    currentSocket.on("typing", function(data) {
      setReceiving(true);
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
      // setFeedback(prevFeedback => {
      //   if (prevFeedback.length === 0) {
      //     return [
      //       ...prevFeedback,
      //       <p key={data.id}>
      //         <em>{data.handle} is typing </em>
      //       </p>
      //     ];
      //   }
      //   if (prevFeedback.length > 0) {
      //     console.log("hi");

      //     // prevFeedback.forEach(fb => {
      //     for (let i = 0; i < prevFeedback.length; i++) {
      //       if (prevFeedback[i].key === data.id) {
      //         console.log(prevFeedback[0].key);

      //         console.log("u da same");
      //         return setFeedback(prevFeedback => prevFeedback);
      //       } else {
      //         console.log("u diff");

      //         return setFeedback(prevFeedback => [
      //           ...prevFeedback,
      //           <p key={data.id}>
      //             <em>{data.handle} is typing </em>
      //           </p>
      //         ]);
      //       }
      //     }
      //     // });
      //   }
      // });
    });
    console.log(feedback);
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
