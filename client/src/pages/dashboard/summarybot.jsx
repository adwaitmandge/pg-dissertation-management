import { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from "axios";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import FileUploadComponent from "./fileupload";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { Spinner, Toast, Tooltip, useToast } from "@chakra-ui/react";

function Summary() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sourceId, setSourceId] = useState(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [file, setFile] = useState();
  const [docs, setDocs] = useState();
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const sample = `The document starts with an introduction to AI, explaining what it is and how it works. It then goes on to provide an overview of AI, discussing its history, current state, and future potential. The document also covers the various applications of AI, including natural language processing, computer vision, and robotics.

  One of the key sections of the document is the description of the modules depicted in a diagram on page 26. These modules include data acquisition, data preprocessing, feature extraction, model selection, and evaluation. The document provides a detailed explanation of each of these modules and how they work together to create an AI system.
    
    The document also discusses the ethical considerations surrounding AI, including issues related to privacy, bias, and job displacement. It emphasizes the importance of responsible AI development and the need for ethical guidelines to be established.
    
    In addition to discussing the technical aspects of AI, the document also provides examples of how AI is being used in various industries. These examples include healthcare, finance, and transportation. The document highlights the benefits of AI in these industries, such as improved efficiency and accuracy.
    
    Overall, this document provides a comprehensive introduction to AI, covering both the technical and ethical aspects of the technology. It is a valuable resource for anyone looking to learn more about AI and its potential impact on society.`;
  const toast = useToast();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
  };

  useEffect(() => {
    if (sourceId !== null) {
      // Once sourceId is available, you can initiate the conversation
      handleSend("Summarize the document in 600 words");
    }
  }, [sourceId]);

  const toggleFileUpload = () => {
    setIsFileUploadOpen(!isFileUploadOpen);
  };

  const uploadFileToCloudinary = async () => {
    if (!file) {
      console.error("No file selected.");
      toast({
        title: "No file detected!",
        description: "Please select a file.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    setLoading(true);
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
        setDocs([{ uri: response.data.secure_url }]);
        // Now you can call addUrlToChatPdf() with the Cloudinary file URL
        addUrlToChatPdf(response.data.secure_url);
      } else {
        console.error("Cloudinary upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
    }
  };

  const addUrlToChatPdf = async (link) => {
    const apiUrl = "https://api.chatpdf.com/v1/sources/add-url";
    const apiKey = "sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r";

    const headers = {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    };

    const data = {
      url: link,
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      console.log("Source ID:", response.data.sourceId);
      setSourceId(response.data.sourceId);
    } catch (error) {
      console.error("Error:", error.message);
      console.error("Response:", error.response?.data);
    }
  };

  async function processMessage(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const data = {
      sourceId: sourceId,
      messages: [...apiMessages],
    };

    const apiUrl = "https://api.chatpdf.com/v1/chats/message";
    const apiKey = "sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r";

    const headers = {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      setMessages([
        {
          message: response.data.content,
          sender: "ChatGPT",
        },
      ]);
      console.log(response.data.content);
      setResult(response.data.content);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error.message);
      console.error("Response:", error.response?.data);
    }
  }
  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    console.log("INside handle send");
    console.log("Source id here is", sourceId);

    const newMessages = [...messages, newMessage];

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    if (sourceId) {
      setIsTyping(true);
      await processMessage(newMessages);
      setLoading(false);
    } else {
      console.error(
        "sourceId is null. Make sure addUrlToChatPdf has completed before sending messages."
      );
    }
  };

  const downloadFile = async () => {
    try {
      if (!result) {
        toast({
          title: "No file detected",
          description: "Upload a file to generate summary.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }

      const body = { data: result };

      console.log("About to send request");
      const res = await fetch("http://localhost:5000/api/thesis/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(data);
      console.log("After` request");
      toast({
        title: "File downloaded",
        description: "Check your Desktop",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to download summary",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      console.error(err.message);
    }
  };

  return (
    <div className="">
      {/* <div style={{ position: "relative", height: "800px", width: "700px" }}> */}
      <div className=" ">
        {/* <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? <TypingIndicator content="Summarizing" /> : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
          </ChatContainer>
        </MainContainer> */}

        <div class="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
          <div class="flex items-center justify-between border-b px-3 py-2 dark:border-gray-600">
            <div class="flex flex-wrap items-center divide-gray-200 dark:divide-gray-600 sm:divide-x">
              <div class="flex items-center space-x-1 sm:pr-4">
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 12 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                    />
                  </svg>
                  <span class="sr-only">Attach file</span>
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                  </svg>
                  <span class="sr-only">Embed map</span>
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                  </svg>
                  <span class="sr-only">Upload image</span>
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                    <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z" />
                  </svg>
                  <span class="sr-only">Format code</span>
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                  </svg>
                  <span class="sr-only">Add emoji</span>
                </button>
              </div>
              <div class="flex flex-wrap items-center space-x-1 sm:pl-4">
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 21 18"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.5 3h9.563M9.5 9h9.563M9.5 15h9.563M1.5 13a2 2 0 1 1 3.321 1.5L1.5 17h5m-5-15 2-1v6m-2 0h4"
                    />
                  </svg>
                  <span class="sr-only">Add list</span>
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                  </svg>
                  <span class="sr-only">Settings</span>
                </button>
                <button
                  type="button"
                  class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    class="h-4 w-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z" />
                    <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z" />
                  </svg>
                  <span class="sr-only">Timeline</span>
                </button>
                <Tooltip label="Download Summary">
                  <button
                    onClick={downloadFile}
                    type="button"
                    class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    <svg
                      class="h-4 w-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                    </svg>
                    <span class="sr-only">Download</span>
                  </button>
                </Tooltip>
              </div>
            </div>
            <Tooltip label="Full Screen">
              <button
                type="button"
                data-tooltip-target="tooltip-fullscreen"
                class="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white sm:ml-auto"
              >
                <svg
                  class="h-4 w-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 19 19"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                  />
                </svg>
                <span class="sr-only">Full screen</span>
              </button>
            </Tooltip>
          </div>
          <div class="rounded-b-lg bg-white px-4 py-2 dark:bg-gray-800">
            <label for="editor" class="sr-only">
              Publish post
            </label>
            <textarea
              id="editor"
              rows={!result ? "8" : "15"}
              class="block w-full border-0 bg-white px-0 text-sm text-gray-800 focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
              placeholder="Write an article..."
              required
              value={!result ? "Upload a file" : result}
            ></textarea>
          </div>
        </div>
      </div>
      {/* <FileUploadComponent
        addUrlToChatPdf={addUrlToChatPdf}
        onClose={toggleFileUpload} // Pass a callback to close the component
      /> */}
      {/* <h2>Upload a PDF File</h2>
      <input type="file" accept=".pdf, .docx" onChange={handleFileChange} />
      <button onClick={uploadFileToCloudinary}>Upload</button> */}
      <div className="mb-3 mt-2">
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
            {loading ? <Spinner color="white" /> : "Summarise"}
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

export default Summary;
