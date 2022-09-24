import React from 'react';
import WebcamCapture from './components/webcamcapture.js';
import io from "socket.io-client";
import './App.css';

let endPoint = "localhost:5500";

const App = () => {

  const [socketInstance, setSocketInstance] = React.useState(null);

  React.useEffect(() => {
    let socketInitiated = false;

    const socket = io(endPoint, {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
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