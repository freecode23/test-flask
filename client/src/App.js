import React from 'react';
import WebcamCapture from './components/webcamcapture.js';
import './App.css';


const App = () => {


  return (
    <>
      <div>
        <div className='head'>
          <h2>Live Face Recognition run on the Web</h2>
        </div>
        <WebcamCapture />
        {/* <Messages /> */}
      </div>

    </>
  )
}



export default App;