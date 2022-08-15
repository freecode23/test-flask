
import React, { useState } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';

const WebcamCapture = () => {

    const webcamRef = React.useRef(null);
    const videoConstraints = {
        width: 416,
        height: 416,
        facingMode: 'user'
    };

    const [name, setPersonName] = useState('')
    const handleCapture = React.useCallback(
        () => {
            // 1. get screenshot in base64 format
            const imageSrc = webcamRef.current.getScreenshot();

            console.log(`imageSrc = ${imageSrc}`)

            // for deployment, you should put your backend url / api
            // 2. send post request to process frame
            axios.post('http://0.0.0.0:5000/api', { data: imageSrc })
                .then(res => {
                    console.log(`response = ${res.data}`)
                    setPersonName(res.data)
                })
                .catch(error => {
                    console.log(`error = ${error}`)
                })
        },
        [webcamRef]
    );

    return (
        <div>
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
        </div>
    );

};

export default WebcamCapture;