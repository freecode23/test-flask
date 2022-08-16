
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import io from "socket.io-client";
let endPoint = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const WebcamCapture = () => {

    const webcamRef = React.useRef(null);
    const [processedFrame, setProcessedFrame] = useState(null);
    const [name, setDataName] = useState('')

    const videoConstraints = {
        width: 416,
        height: 416,
        facingMode: 'user'
    };


    // 1. HTTP send frames
    const handleCapture = React.useCallback(
        () => {
            // - get screenshot in base64 format
            const imageSrc = webcamRef.current.getScreenshot();
            // console.log(`imageSrc = ${imageSrc}`)

            // - send post request to process a single image shot
            axios.post('http://0.0.0.0:5000/api', { data: imageSrc })
                .then(res => {
                    console.log(`response = ${res.data}`)
                    setDataName(res.data)
                    
                    const output = 'data:image/jpeg;base64,' + res.data
                    setProcessedFrame(output)
                })
                .catch(error => {
                    console.log(`error = ${error}`)
                })
        },
        [webcamRef]
    );
    
    return (
        <div>
            {/* 1. Webcam */}
            <Webcam
                audio={false}
                height={300}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={350}
                videoConstraints={videoConstraints}
            />
            <button onClick={handleCapture}>Click Me!</button>
            <h2>{name}</h2>
            

            {/* 2. Http response */}
            <p>VideoResponse</p>
            <img
                src={processedFrame}
                alt="Video"
                width="700px"
            />
        </div>
    );

};

export default WebcamCapture;