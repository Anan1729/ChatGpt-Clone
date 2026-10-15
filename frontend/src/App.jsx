import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatHeader from "./components/ChatHeader/ChatHeader";
import MessageList from "./components/MessageList/MessageList";
import ChatInput from "./components/ChatInput/ChatInput";
import { useChatBackend } from "./hooks/useChatBackend";
import "./App.css";

function App() {
  const { conversations, isLoading, sendMessage, clearChat } = useChatBackend();

  return (
    <div className="app-container">
      <Sidebar clearChat={clearChat} />
      <div className="main-chat-area">
        <ChatHeader />
        <div className="chat-feed-scroll">
          <MessageList conversations={conversations} isLoading={isLoading} />
        </div>
        <ChatInput
          handleSendMessage={sendMessage}
          isLoading={isLoading}
          showSuggestions={conversations.length === 0} // Only show if history is completely clear
        />
      </div>
    </div>
  );
}

export default App;
