import React from 'react';
import WebcamCapture from './components/webcamcapture.js';
// import WebcamStreamCapture from './components/webcamstream.js';
import io from "socket.io-client";
import './App.css';

// let endPoint = "wss://13.233.110.144";
// let endPoint = "13.233.110.144";
// let endPoint = "13.233.110.144:5500";
// let endPoint = "ws://127.0.0.1";

// Question: how to make it handle many request from different browser client?
let endPoint = "wss://toptal.poc.com";

const App = () => {

  const [socketInstance, setSocketInstance] = React.useState(null);

  React.useEffect(() => {
    let socketInitiated = false;

    const socket = io.connect(endPoint, {
      transports: ["websocket"],
      cors: {
	      origin: "*",
        // origin: "http://13.233.110.144:3000/",
      },
    });

    setSocketInstance(socket);

    try{
      socket.on("init", (data) => {
        socketInitiated = true;
        console.log("socket instance created..");
        console.log("server>>", data)
        // console.log("server>>", JSON.parse(data))
      });
    } catch (err) {
      console.log("no connection ack from backend yet..");
    }

    return function cleanup() {
      if (socketInitiated) {
        // socket.disconnect();
        // socket.readyState === 1
        socket.close();
        console.log("socket instance closed..");
      }
    };

  }, []);

  return (
    <>
      <div>
          <WebcamCapture socket={socketInstance} />
      </div>
    </>
  )
}



export default App;
