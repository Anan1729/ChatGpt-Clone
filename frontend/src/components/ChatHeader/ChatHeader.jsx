import React, { useState, useEffect } from "react";
import { ChevronDown, Sun, Moon } from "lucide-react";
import styles from "./ChatHeader.module.css";

const ChatHeader = () => {
  // Read initial theme preference from localStorage, default to dark mode
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  // Apply the active theme class to the HTML root container
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.brandTitle}>ChatGPT</span>
        <ChevronDown size={16} className={styles.chevronIcon} />
      </div>

      <div className={styles.right}>
        {/* Dark Mode Icon Trigger Button (Bonus Feature) */}
        <button
          className={styles.themeToggleBtn}
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          type="button"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Profile Avatar Frame */}
        <div className={styles.avatar}>A</div>
      </div>
    </header>
  );
};

// Exporting at the bottom to remain matching your preferred pattern rules
export default ChatHeader;
