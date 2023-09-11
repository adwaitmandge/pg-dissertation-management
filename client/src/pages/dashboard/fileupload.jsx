import React, { useState } from 'react';
import axios from 'axios';
 
const FileUploadComponent = ({addUrlToChatPdf}) => {
  const [file, setFile] = useState(null);
 
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
  };
 
  const uploadFileToCloudinary = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }
 
    // Create a FormData object to send the file to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'hfcakj4l'); // Replace with your Cloudinary upload preset
    formData.append('resource_type', 'raw'); // Set the resource_type to 'raw'
 
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dralpqhoq/raw/upload',
        formData
      );
 
      if (response.data.secure_url) {
        console.log('File uploaded to Cloudinary:', response.data.secure_url);
        // Now you can call addUrlToChatPdf() with the Cloudinary file URL
        
        addUrlToChatPdf(response.data.secure_url);
      } else {
        console.error('Cloudinary upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
    }
  };
 
  return (
    <div>
      <h2>Upload a PDF File</h2>
      <input type="file" accept=".pdf, .docx" onChange={handleFileChange} />
      <button onClick={uploadFileToCloudinary}>Upload</button>
    </div>
  );
};
 
export default FileUploadComponent;