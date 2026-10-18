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
      if (!currentSessionId || currentSessionId === "undefined") {
        const sessionResponse = await fetch(
          `${API_BASE_URL}/api/chat/sessions/new`,
          { method: "POST" },
        );
        const sessionJson = await sessionResponse.json();

        if (sessionJson.success && sessionJson.data) {
          // FIX 1: Safely handle if data comes as an array or an object
          if (Array.isArray(sessionJson.data) && sessionJson.data.length > 0) {
            currentSessionId =
              sessionJson.data[0].id || sessionJson.data[0].sessionId;
          } else {
            currentSessionId =
              sessionJson.data.id || sessionJson.data.sessionId;
          }

          if (currentSessionId) {
            localStorage.setItem("active_chat_session_id", currentSessionId);
            window.dispatchEvent(new Event("sidebar-refresh"));
          } else {
            console.error("Could not find a valid ID inside sessionJson.data");
            setIsLoading(false);
            return;
          }
        } else {
          console.error(
            "Could not construct background session pipeline validation parameters",
          );
          setIsLoading(false);
          return;
        }
      }

      // Step C: Transmit the user's question along with the clean session ID
      const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, sessionId: currentSessionId }),
      });

      const json = await response.json();

      // FIX 2: Check if response has valid success and data payload back from Gemini
      if (json.success && json.data) {
        const botMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          // FIX 3: Check all common layout positions where Gemini saves text answers
          content:
            json.data.reply ||
            json.data.content ||
            json.data.text ||
            (typeof json.data === "string"
              ? json.data
              : "Response logged successfully."),
        };
        setConversations((prev) => [...prev, botMessage]);
        window.dispatchEvent(new Event("sidebar-refresh"));
      } else {
        // Fallback banner triggered only if the backend truly crashes or flags an error
        const botMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "⚠️ **The AI server is currently experiencing high traffic.** Spikes in demand are temporary. Please wait a moment and click send again!",
        };
        setConversations((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Failed to transmit user prompt:", error);
      const connectionErrorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "❌ **Connection Error.** Unable to communicate with the server. Please verify your internet connection or server state and try again.",
      };
      setConversations((prev) => [...prev, connectionErrorMessage]);
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
};;


export { useChatBackend };
