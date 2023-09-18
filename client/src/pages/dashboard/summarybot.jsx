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

function Summary() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sourceId, setSourceId] = useState(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  useEffect(() => {
    if (sourceId !== null) {
      // Once sourceId is available, you can initiate the conversation
      handleSend("Summarize the document in 600 words");
    }
  }, [sourceId]);

  const toggleFileUpload = () => {
    setIsFileUploadOpen(!isFileUploadOpen);
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
    } else {
      console.error(
        "sourceId is null. Make sure addUrlToChatPdf has completed before sending messages."
      );
    }
  };

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
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
        </MainContainer>
        {/* <button onClick={handleAddUrlClick}>Add URL to ChatPDF</button>      */}
        {/* Conditionally render the FileUploadComponent */}
        {isFileUploadOpen && (
          <FileUploadComponent
            addUrlToChatPdf={addUrlToChatPdf}
            onClose={toggleFileUpload} // Pass a callback to close the component
          />
        )}

        {/* Button to open/close the FileUploadComponent */}
        <button onClick={toggleFileUpload}>
          {isFileUploadOpen ? "Close File Upload" : "Open File Upload"}
        </button>
      </div>
    </div>
  );
}

export default Summary;
