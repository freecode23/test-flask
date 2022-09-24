import { useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import "./webcam.css";

let serverAck = false;

const videoConstraints = {
  width: 416,
  height: 416,
  facingMode: "user",
};

const WebcamCapture = ({socket}) => {
  const webcamRef = useRef(null);
  const [processedFrame, setProcessedFrame] = useState(null);


  // A. websocket sendFrames >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const sendFrames = useCallback(() => {
    try {
      // - get screenshot in base64 format
      const imageSrc = webcamRef.current.getScreenshot();

      // - send image through websocket
      socket.emit("frame", imageSrc);
    } catch (err) {
      console.log(err);
    }
  }, [socket]);

  const getFrames = useCallback(() => {
    try {
      socket.on("frame", (data) => {
        // console.log("content>>", JSON.parse(data).image)
        const output = "data:image/jpeg;base64," + JSON.parse(data).image;
        setProcessedFrame(output);
      });
    } catch (err) {
      // console.log(err);
      console.log("no event received yet from backend..");
    }
  }, [socket]);

  useEffect(() => {

    console.log("now listening for events from backend..")

    try{
      socket.on("init", (data) => {
        // console.log("server>>", data)
        console.log("intitiating events from frontend..")
        // console.log("server>>", JSON.parse(data))
      });
      serverAck = true;
    } catch (err) {
      console.log("no connection ack from backend yet..");
    }

    if (serverAck) {
      //Setup listener to get frames
      getFrames();
      console.log(`initializing sendFrames() interval`);
      const interval = setInterval(() => {
        // send frames every 50ms
        sendFrames();

        // getFrames();
      }, 50);
      return () => {
        console.log(`clearing sendFrames() interval`);
        clearInterval(interval);
      };
    }

  }, [socket, getFrames, sendFrames]);

  return (
    <div className="frames">
      {/* 1. Webcam */}
      <div className="webcam">
        <h1>Webcam</h1>
        <Webcam
          // audio={false}
          muted={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          // style={{ opacity: 0 }}
        />
      </div>

      {/* 2. Processd Response */}
      <div className="processed">
        <h1>Processed Frame</h1>
        <img src={processedFrame} alt="Video" width="700px" />
      </div>
    </div>
  );
};

export default WebcamCapture;
