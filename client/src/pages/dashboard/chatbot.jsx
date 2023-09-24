import { useState, useRef } from "react";
// import './App.css'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from "axios";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import FileUploadComponent from "./fileupload";
import "./chatbot.css";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { Spinner, useToast } from "@chakra-ui/react";

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sourceId, setSourceId] = useState(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const [file, setFile] = useState();
  const [files, setFiles] = useState(null);
  const [docs, setDocs] = useState();
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
  };

  const uploadFileToCloudinary = async () => {
    if (!file) {
      console.error("No file selected.");
      toast({
        title: "No file detected!",
        description: "Please upload a file",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
        // Now you can call addUrlToChatPdf() with the Cloudinary file URL
        setDocs([{ uri: response.data.secure_url }]);
        addUrlToChatPdf(response.data.secure_url);
      } else {
        console.error("Cloudinary upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
    }
  };

  // send files to the server // learn from my other video
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("Files", files);
    console.log(formData.getAll());
    // fetch(
    //   "link", {
    //     method: "POST",
    //     body: formData
    //   }
    // )
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
      toast({
        title: "File Uploaded!",
        description: "Ask questions",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
    } catch (error) {
      toast({
        title: "Upload Failed!",
        description: "Please try again!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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

    const apiUrl = "https://api.chatpdf.com/v1/chats/message";
    const apiKey = "sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r";

    const headers = {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    };

    const data = {
      sourceId: sourceId,
      messages: [...apiMessages],
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      setMessages([
        ...chatMessages,
        {
          message: response.data.content,
          sender: "ChatGPT",
        },
      ]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error:", error.message);
      console.error("Response:", error.response?.data);
    }
  }

  // const handleAddUrlClick = () => {
  //   addUrlToChatPdf();
  // };
  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    if (sourceId) {
      setIsTyping(true);
      await processMessage(newMessages);
    } else {
      console.error(
        "sourceId is null. Make sure addUrlToChatPdf has completed before sending messages."
      );
    }
  };

  return (
    <>
      <div className="">
        <div style={{ position: "relative", height: "500px", width: "100%" }}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? <TypingIndicator content="Typing" /> : null
                }
              >
                {messages.map((message, i) => {
                  console.log(message);
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
          {/* <button onClick={handleAddUrlClick}>Add URL to ChatPDF</button>      */}
          {/* Conditionally render the FileUploadComponent */}
        </div>
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
              {loading ? <Spinner color={"white"} /> : "Upload"}
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
    </>
  );
}

export default Chatbot;
