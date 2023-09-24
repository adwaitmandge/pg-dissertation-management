import { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from "axios";
import UserListItem from "@/components/UserAvatar/UserListItem";

import { useNavigate } from "react-router-dom";import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import FileUploadComponent from "./fileupload";
import { UserState } from "@/context/UserProvider";
import DocViewer, { PDFRenderer, DocViewerRenderers } from "react-doc-viewer";

function ThesisUpload() {
  const { user } = UserState();

  const [fileLoading, setFileLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [publicationName, setPublicationName] = useState("");
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState();
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Other state and context variable declarations...

  const navigate = useNavigate();

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/thesis/allment?search=${query}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
      setShowResults(true); // Show the search results dropdown
    } catch (error) {
      console.error("Error occurred:", error);
      setLoading(false);
      // Handle error and display an error message if needed
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
  };

  const submitHandler = async () => {
    if (!user) {
      console.log("No user");
      return;
    }

    setLoading(true);
    try {
      console.log("About to send request");
      const res = await fetch("http://localhost:5000/api/thesis/submitThesis", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          publications,selectedUserId
        }),
      });

      console.log("After the request");
      const data = await res.json();

      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const uploadFileToCloudinary = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    setFileLoading(true);
    // Create a FormData object to send the file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "hfcakj4l"); // Replace with your Cloudinary upload preset
    formData.append("resource_type", "raw"); // Set the resource_type to 'raw'

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dralpqhoq/raw/upload",
        formData
      );

      if (response.data.secure_url) {
        console.log("File uploaded to Cloudinary:", response.data.secure_url);
        setPublications([
          ...publications,
          { cloudinaryLink: response.data.secure_url },
        ]);

        setDocs([{ uri: response.data.secure_url }]);
        console.log(publications);
        setPublicationName("");

        setFileLoading(false);
      } else {
        console.error("Cloudinary upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
    }
  };
  const [selectedUserId, setSelectedUserId] = useState(null);
console.log(selectedUserId);
  // const docs = [
  //   {
  //     uri: "https://res.cloudinary.com/dralpqhoq/raw/upload/v1694866431/qoeahcitxmwlkumhg7mb.docx",
  //   },
  // ];

  return (


    <div className="flex items-center">
      <div className="mr-auto flex-1 md:mr-4 md:w-56">
        <Input
          onClick={() => setShowResults(!showResults)}
          onChange={(e) => {
            setInput(e.target.value);
            handleSearch(e.target.value);
          }}
          className="mr-3"
          label="Search Users"
        />
        {loading ? (
          <div>Loading</div>
        ) : (
          <div
            className={`absolute z-50 rounded-3xl bg-white ${
              showResults ? "" : "hidden"
            } p-4 shadow-lg`}
          >      {searchResult?.map((user, index) => (
            <div
              onClick={() => {
                console.log("I am", user);
                setSelectedUserId(user.to._id);
              }}
              key={user._id}
            >
              <UserListItem
                user={user.to}
                onClick={() => {
                  console.log("Clicked");
                }}
              />
            </div>
          ))}
          {searchResult.length === 0 && <div>No results found.</div>}
          </div>
        )}
      </div>

    
    <div className="mb-3 pt-11">
      {/* <div style={{ position: "relative", height: "800px", width: "700px" }}> */}
      <div>
        <div className="">
          <label
            class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            for="file_input"
          >
            Upload file
          </label>
          <input
            accept=".pdf, .docx"
            onChange={handleFileChange}
            class="mb-3 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
            id="file_input"
            type="file"
          />
        </div>
        {/* Button to open/close the FileUploadComponent */}
        {/* <button onClick={toggleFileUpload}>
                        {isFileUploadOpen
                          ? "Close File Upload"
                          : "Open File Upload"}
                      </button> */}
        {fileLoading ? (
          <li class="flex items-center">
            <div role="status">
              <svg
                aria-hidden="true"
                class="mr-2 h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
            Preparing your file
          </li>
        ) : (
          <div className=""></div>
        )}
        <button
          type="button"
          disabled={fileLoading}
          onClick={uploadFileToCloudinary}
          className="mb-2 inline-flex w-[100%] items-center justify-center rounded-lg bg-[#050708] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#050708]/90 focus:outline-none focus:ring-4 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50"
        >
          Upload
        </button>
        <button
          onClick={submitHandler}
          disabled={loading}
          type="button"
          class="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </div>
      {docs && (
        <DocViewer
          className="h-[70vh]"
          pluginRenderers={DocViewerRenderers}
          documents={docs}
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false,
            },
          }}
        />
      )}
    </div>
    </div>
  );
}

export default ThesisUpload;
