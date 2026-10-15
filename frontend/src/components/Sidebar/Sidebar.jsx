import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Image as ImageIcon,
  LayoutGrid,
  Microscope,
  Code2,
  FolderKanban,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2, // Added professional utility icon to clear single sessions
} from "lucide-react";
import styles from "./Sidebar.module.css";

// Dynamic switch API endpoint bases depending on your production context matching your hook layer
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Sidebar = ({ clearChat }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [sessions, setSessions] = useState([]); // Dynamic chat threads history list
  const [activeId, setActiveId] = useState(
    localStorage.getItem("active_chat_session_id"),
  );

  // 1. Core workflow to pull session list records out of your database tables
  const loadSidebarSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/sessions`);
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        setSessions(json.data);
      }
    } catch (error) {
      console.error("Failed to load historical sidebar titles:", error);
    }
  };

  // 2. Add event trackers to listen to changes on component borders automatically
  useEffect(() => {
    loadSidebarSessions();

    const handleRefreshEvent = () => {
      loadSidebarSessions();
      setActiveId(localStorage.getItem("active_chat_session_id"));
    };

    window.addEventListener("sidebar-refresh", handleRefreshEvent);
    return () =>
      window.removeEventListener("sidebar-refresh", handleRefreshEvent);
  }, []);

  // 3. Select an old chat folder and load its specific conversation stream
  const handleSelectSession = (sessionId) => {
    localStorage.setItem("active_chat_session_id", sessionId);
    setActiveId(sessionId);
    // Tell the custom hook that a new active conversation folder context has loaded
    window.dispatchEvent(new Event("active-session-updated"));
  };

  // 4. Industry-Standard "New Chat" Screen Refresh (Frontend only—zero deletion!)
  const handleNewChatClick = (e) => {
    e.preventDefault();
    localStorage.removeItem("active_chat_session_id");
    setActiveId(null);
    window.dispatchEvent(new Event("active-session-updated"));
  };

  // 5. Professional Addition: Drop a single chat thread from history list
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation(); // Stops parent container click triggers from firing simultaneously
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/chat/sessions/${sessionId}`,
        {
          method: "DELETE",
        },
      );
      const json = await response.json();
      if (json.success) {
        if (localStorage.getItem("active_chat_session_id") === sessionId) {
          localStorage.removeItem("active_chat_session_id");
          setActiveId(null);
          window.dispatchEvent(new Event("active-session-updated"));
        }
        loadSidebarSessions();
      }
    } catch (error) {
      console.error("Failed to delete individual session:", error);
    }
  };

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          {/* Interactive Collapsible Window Trigger Hook */}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={toggleSidebar}
            title={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>
        </div>

        {isOpen && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleNewChatClick}
            title="Start fresh conversation"
          >
            <MessageSquare size={20} />
          </button>
        )}
      </div>

      {/* Navigation panel contents only render visibly when sidebar container is expanded */}
      <nav
        className={`${styles.nav} ${isOpen ? styles.visible : styles.hidden}`}
      >
        <a
          href="#"
          className={`${styles.item} ${styles.newChatBtn}`}
          onClick={handleNewChatClick}
        >
          <MessageSquare size={18} />
          <span>New chat</span>
        </a>

        {/* Dynamic Historic Conversation Lists Segment Wrapper */}
        {sessions.length > 0 && (
          <div className={styles.historyListWrapper}>
            <div className={styles.historyLabel}>Recent Chats</div>
            {sessions.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.item} ${chat.id === activeId ? styles.activeSessionItem : ""}`}
                onClick={() => handleSelectSession(chat.id)}
              >
                <MessageSquare size={18} />
                <span className={styles.sessionTitleText}>{chat.title}</span>
                {/* Single Thread Delete Trash Icon Button Action */}
                <button
                  type="button"
                  className={styles.singleDeleteBtn}
                  onClick={(e) => handleDeleteSession(e, chat.id)}
                  title="Delete chat thread"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <a href="#" className={styles.item}>
          <Search size={18} />
          <span>Search chats</span>
        </a>
        <a href="#" className={styles.item}>
          <ImageIcon size={18} />
          <span>Images</span>
        </a>
        <a href="#" className={styles.item}>
          <LayoutGrid size={18} />
          <span>Apps</span>
        </a>
        <a href="#" className={styles.item}>
          <Microscope size={18} />
          <span>Deep research</span>
        </a>
        <a href="#" className={styles.item}>
          <Code2 size={18} />
          <span>Codex</span>
        </a>
        <a href="#" className={styles.item}>
          <FolderKanban size={18} />
          <span>Projects</span>
        </a>
      </nav>
    </aside>
  );
};

// Exporting at the bottom to remain matching your preferred pattern rules
export default Sidebar;
