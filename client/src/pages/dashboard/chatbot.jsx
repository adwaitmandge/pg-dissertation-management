import { useState } from 'react'
// import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import axios from 'axios';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import FileUploadComponent from './fileupload';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      message: "Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sourceId,setSourceId] = useState(null);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);

  const toggleFileUpload = () => {
    setIsFileUploadOpen(!isFileUploadOpen);
  };
  


  const addUrlToChatPdf = async (link) => {
    const apiUrl = 'https://api.chatpdf.com/v1/sources/add-url';
    const apiKey = 'sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r';

    const headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };

    const data = {
      url: link,
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      console.log('Source ID:', response.data.sourceId);
      setSourceId(response.data.sourceId);
      alert("Document uploaded successfully")
    } catch (error) {
      console.error('Error:', error.message);
      console.error('Response:', error.response?.data);
    }
  };

  async function processMessage(chatMessages) { // messages is an array of messages
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
      return { role: role, content: messageObject.message}
    });

    const apiUrl = 'https://api.chatpdf.com/v1/chats/message';
    const apiKey = 'sec_gxkDpDyDqYF6qQZzgWrJZ1OIKUecpt0r';

    const headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };

    const data = {
      sourceId: sourceId,
      messages: [
        ...apiMessages
      ],
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      setMessages([...chatMessages, {
        message: response.data.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error:', error.message);
      console.error('Response:', error.response?.data);
    }
  }

  // const handleAddUrlClick = () => {
  //   addUrlToChatPdf();
  // };
  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    if (sourceId) {
      setIsTyping(true);
      await processMessage(newMessages);
    } else {
      console.error('sourceId is null. Make sure addUrlToChatPdf has completed before sending messages.');
    }
  };

  return (
    <div className="App">
      <div style={{ display:"grid",  gridTemplateColumns: "2fr 1fr 1fr"  }}>
        <MainContainer>
          <ChatContainer style={{height:"700px"}}>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />   
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
        {isFileUploadOpen ? 'Close File Upload' : 'Open File Upload'}
      </button>
      
      </div>
    </div>
  )
}

export default Chatbot;