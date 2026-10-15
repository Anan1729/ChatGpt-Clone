import { useState, useEffect } from "react";

// 💡 PRODUCTION MODIFICATION: Dynamically switch API endpoint bases depending on environment context
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useChatBackend = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch conversation history when the user opens the web application
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/conversations`);
        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          setConversations(json.data);
        }
      } catch (error) {
        console.error("Failed to load historical chat logs:", error);
      }
    };

    fetchChatHistory();
  }, []);

  // 2. Core action to send a prompt to the backend server
  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setConversations((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const json = await response.json();

      if (json.success) {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            json.data.reply ||
            json.data.content ||
            "Message logged in database successfully.",
        };
        setConversations((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Failed to transmit user prompt:", error);
    } finally {
      setIsLoading(false); // Guaranteeing loader releases under production load boundaries
    }
  };

  // 3. Clear conversation workflow
  const clearChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
        method: "DELETE",
      });
      const json = await response.json();
      if (json.success) {
        setConversations([]);
      }
    } catch (error) {
      console.error("Failed to clear chat log:", error);
    }
  };

  return { conversations, isLoading, sendMessage, clearChat };
};

export { useChatBackend };
