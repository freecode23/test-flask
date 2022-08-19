
import React, { useState, useEffect} from 'react';
import Webcam from 'react-webcam';
import io from "socket.io-client";
let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const WebcamCapture = () => {

    const webcamRef = React.useRef(null);
    const [processedFrame, setProcessedFrame] = useState(null);

    const videoConstraints = {
        width: 416,
        height: 416,
        facingMode: 'user'
    };

    // 1. HTTP send frames
    // const sendFrames = React.useCallback(
    //     () => {
    //         // - get screenshot in base64 format
    //         const imageSrc = webcamRef.current.getScreenshot();
    //         // console.log(`imageSrc = ${imageSrc}`)

    //         // - send post request to process a single image shot
    //         axios.post('http://0.0.0.0:5000/api', { data: imageSrc })
    //             .then(res => {
    //                 console.log(`response = ${res.data}`)
    //                 setDataName(res.data)
                    
    //                 const output = 'data:image/jpeg;base64,' + res.data
    //                 setProcessedFrame(output)
    //             })
    //             .catch(error => {
    //                 console.log(`error = ${error}`)
    //             })
    //     },
    //     [webcamRef]
    // );

    // 2. websocket sendFrames
    const sendFrames = React.useCallback(
        () => {
            try {
                // - get screenshot in base64 format
                const imageSrc = webcamRef.current.getScreenshot();
                
                // - send image through websocket
                socket.emit("frame", imageSrc);
            } catch (err) {
                console.log(err);
            }
        },
        []
    );

    const getFrames = () => {
        try {
            socket.on("frame", data => {
                // console.log("content>>", JSON.parse(data).image)
                const output = 'data:image/jpeg;base64,' + JSON.parse(data).image
                setProcessedFrame(output)
            });

        } catch (err) {
            console.log(err)
        }
    };

    React.useEffect(() => {
        console.log(`initializing interval`);
        const interval = setInterval(() => {
            // send and get frames every 50ms
            sendFrames();
            getFrames();
        }, 50);

        return () => {
            console.log(`clearing interval`);
            clearInterval(interval);
        };
    }, []);

    
    return (
        <div>

            {/* 2. Processd Response */}
            <p>Processed Frame</p>
            <img
                src={processedFrame}
                alt="Video"
                width="700px"
            />

            {/* 1. Webcam */}
            <Webcam
                // audio={false}
                muted={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={{ opacity: 0 }}
            />
            <button onClick={sendFrames}>Click Me!</button>

        </div>
    );

};

export default WebcamCapture;