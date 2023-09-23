import { useState } from "react";
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

function Scibot() {
  const [messages, setMessages] = useState([
    {
      message: "Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  async function processMessage(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiUrl = "http://localhost:8000/answer";

    const headers = {
      "Content-Type": "application/json",
    };

    const data = {
      messages: [...apiMessages],
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      console.log(response.data.answer);
      setMessages([
        ...chatMessages,
        {
          message: response.data.answer,
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

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setIsTyping(true);
    await processMessage(newMessages);
  };

  return (
    <div className="">
      {/* <div style={{ position: "relative", height: "800px", width: "700px" }}> */}
      <div className="h-[80vh] ">
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
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default Scibot;
