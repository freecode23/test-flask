
// import React, { useState, useEffect } from 'react';
// import io from "socket.io-client";
// let endPoint = "http://localhost:5000";
// let socket = io.connect(`${endPoint}`);

// const Messages = () => {

//     const [messages, setMessages] = useState(["Hello And Welcome"]);
//     const [message, setMessage] = useState("");

//     const onChange = e => {
//         setMessage(e.target.value);
//     };


//     const handleSendMessage = () => {
//         console.log("send message...");
//         if (message !== "") {
//             socket.emit("message", message);
//             setMessage("");
//         } else {
//             alert("Please Add A Message");
//         }
//     };

//     useEffect(() => {
//         getMessages();
//     }, [messages.length]);

//     const getMessages = () => {
//         console.log("getting message...");
//         socket.on("message", msg => {
//             setMessages([...messages, msg]);
//         });
//     };

//     return (
//         <div>
//             <div>
//                 {messages.length > 0 &&
//                     messages.map(msg => (
//                         <div>
//                             <p>{msg}</p>
//                         </div>
//                     ))}
//                 <input value={message} name="message" onChange={e => onChange(e)} />
//                 <button onClick={() => handleSendMessage()}>Send Message</button>
//             </div>

//         </div>
//     );

// };

// export default Messages;