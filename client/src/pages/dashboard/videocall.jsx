import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Videocall = () => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(roomCode);
    navigate(`/dashboard/room/${roomCode}`);
  };

  return (
    <div className="home-page">
      <form onSubmit={handleSubmit} className="form">
        <div>
          <label>Enter Room Code</label>
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            type="text"
            required
            placeholder="Enter Room Code"
          />
        </div>
        <button type="submit">Enter Room</button>
      </form>
    </div>
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
 