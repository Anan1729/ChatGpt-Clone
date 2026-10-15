import { useState, useEffect } from "react";

// 💡 PRODUCTION MODIFICATION: Dynamically switch API endpoint bases depending on environment context
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useChatBackend = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch conversation history when the user opens the web application
  useEffect(() => {
    const fetchChatHistory = async () => {
      // Background Session Check: Isolate historical records for the active thread container
      const activeSessionId = localStorage.getItem("active_chat_session_id");
      if (!activeSessionId) {
        setConversations([]);
        return;
      }

      try {
        // Updated target to pull the chronologically isolated thread array from your session database configuration
        const response = await fetch(
          `${API_BASE_URL}/api/chat/sessions/${activeSessionId}/messages`,
        );
        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          setConversations(json.data);
        }
      } catch (error) {
        console.error("Failed to load historical chat logs:", error);
      }
    };

    fetchChatHistory();

    // Custom background boundary event listener so the Sidebar component can notify this hook to refresh when changing active chats
    const handleSessionChange = () => fetchChatHistory();
    window.addEventListener("active-session-updated", handleSessionChange);
    return () =>
      window.removeEventListener("active-session-updated", handleSessionChange);
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
      // Step A: Silently inspect tracking states in localStorage context
      let currentSessionId = localStorage.getItem("active_chat_session_id");

      // Step B: If starting a fresh chat view session, provision the table line row structure upstream first
      if (!currentSessionId) {
        const sessionResponse = await fetch(
          `${API_BASE_URL}/api/chat/sessions/new`,
          { method: "POST" },
        );
        const sessionJson = await sessionResponse.json();
        if (sessionJson.success) {
          currentSessionId = sessionJson.data.sessionId;
          localStorage.setItem("active_chat_session_id", currentSessionId);
          // Alert sidebar to update list rendering schemas instantly
          window.dispatchEvent(new Event("sidebar-refresh"));
        } else {
          console.error(
            "Could not construct background session pipeline validation parameters",
          );
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Added currentSessionId key mapping match to align smoothly with your modified backend service logic configurations
        body: JSON.stringify({ question: text, sessionId: currentSessionId }),
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
        // Trigger background refresh tracker block to update title snippets dynamically in sidebar display logs
        window.dispatchEvent(new Event("sidebar-refresh"));
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
        // Safely detach local tracking states on systemic wipe actions
        localStorage.removeItem("active_chat_session_id");
        setConversations([]);
        window.dispatchEvent(new Event("sidebar-refresh"));
      }
    } catch (error) {
      console.error("Failed to clear chat log:", error);
    }
  };

  return { conversations, isLoading, sendMessage, clearChat };
};

export { useChatBackend };
