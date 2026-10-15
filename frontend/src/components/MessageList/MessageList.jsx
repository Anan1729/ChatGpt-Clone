import React, { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import ChatMessage from "../ChatMessage/ChatMessage";
import styles from "./MessageList.module.css";

const MessageList = ({ conversations = [], isLoading }) => {
  const containerRef = useRef(null);
  const isAtBottomRef = useRef(true);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    isAtBottomRef.current = isAtBottom;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (isAtBottomRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversations, isLoading]);

  return (
    <div
      className={styles.messagesContainer}
      ref={containerRef}
      onScroll={handleScroll}
    >
      {conversations.length === 0 ? (
        // FIXED: Replaced standard empty text with an elegant personalized greeting banner
        <div className={styles.emptyContainer}>
          <h1 className={styles.greetingHeader}>Hello, A</h1>
          <p className={styles.greetingSubheader}>
            How can I help you design or code today?
          </p>
        </div>
      ) : (
        conversations.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))
      )}

      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingAvatar}>
            <Bot size={18} color="white" />
          </div>
          <div className={styles.loadingIndicator}>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
