import React, { useState } from "react";
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
} from "lucide-react";
import styles from "./Sidebar.module.css";

const Sidebar = ({ clearChat }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Simple handler to trigger page refresh or state wipe for a clear chat log
  const handleNewChatClick = async (e) => {
    e.preventDefault();
    if (clearChat) {
      await clearChat(); // Automatically wipes the database and clears the UI!
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
