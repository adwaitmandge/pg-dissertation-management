import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./videocall.css";
import { useToast } from "@chakra-ui/react";

const Videocall = () => {
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = () => {
    if (!roomCode) {
      console.log("Enter room code");
      
      return;
    }
    e.preventDefault();
    console.log(roomCode);
    navigate(`/dashboard/room/${roomCode}`);
  };

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    // <div class="landing-page">
    //   <div className="home-page">
    //     {/* <form onSubmit={handleSubmit} className="form">
    //     <div>
    //       <label>Enter Room Code</label>
    //       <input
    //         value={roomCode}
    //         onChange={(e) => setRoomCode(e.target.value)}
    //         type="text"
    //         required
    //         placeholder="Enter Room Code"
    //       />
    //     </div>
    //     <button type="submit">Enter Room</button>
    //   </form> */}

    //     <div className="content">
    //       <div className="container">
    //         <div className="info">
    //           <h1>Online Meeting Platform</h1>
    //           <p>
    //             Lorem ipsum dolor sit amet consectetur adipisicing elit.
    //             Repellendus odit nihil ullam nesciunt quidem iste, Repellendus
    //             odit nihil
    //           </p>
    //           <form onSubmit={handleSubmit} className="form">
    //             <div>
    //               <label>Enter Room Code</label>
    //               <input
    //                 value={roomCode}
    //                 onChange={(e) => setRoomCode(e.target.value)}
    //                 type="text"
    //                 required
    //                 placeholder="Enter Room Code"
    //               />
    //             </div>
    //             <button type="submit">Enter Room</button>
    //           </form>
    //         </div>
    //         <div className="image"></div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div class="flex h-full w-[900px] items-center justify-between rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <div>
        <img
          class="h-full  rounded-t-lg"
          src="http://localhost:8080/card.avif"
          alt=""
        />
      </div>
      <div class="mr-9 w-full p-5">
        <div>
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Video Call
          </h5>
        </div>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          Interact with your mentor or student. Enter your room code and share
          it with the people you want to interact with.
        </p>
        <input
          ref={inputRef}
          value={roomCode}
          onChange={(e) => {
            setRoomCode(e.target.value);
            console.log(roomCode);
          }}
          type="text"
          id="default-input"
          class="mb-2 block h-8 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />

        <div
          onClick={handleSubmit}
          className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Enter Room
          <svg
            class="ml-2 h-3.5 w-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </div>
      </div>
    </div>

    // <img src={`http://localhost:8080/card.avif`} />
  );
};
export default Videocall;
// import React, { useState } from 'react';
// import axios from 'axios';

// const Home = ({addUrlToChatPdf}) => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     console.log(selectedFile);
//     setFile(selectedFile);
//   };

//   const uploadFileToCloudinary = async () => {
//     if (!file) {
//       console.error('No file selected.');
//       return;
//     }

//     // Create a FormData object to send the file to Cloudinary
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'hfcakj4l'); // Replace with your Cloudinary upload preset

//     try {
//       const response = await axios.post(
//         'https://api.cloudinary.com/v1_1/dralpqhoq/image/upload',
//         formData
//       );

//       if (response.data.secure_url) {
//         console.log('File uploaded to Cloudinary:', response.data.secure_url);
//         // Now you can call addUrlToChatPdf() with the Cloudinary file URL

//         //addUrlToChatPdf(response.data.secure_url);
//       } else {
//         console.error('Cloudinary upload failed.');
//       }
//     } catch (error) {
//       console.error('Error uploading file to Cloudinary:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload a PDF File</h2>
//       <input type="file" accept=".pdf" onChange={handleFileChange} />
//       <button onClick={uploadFileToCloudinary}>Upload</button>
//     </div>
//   );
// };

// export default Home;
