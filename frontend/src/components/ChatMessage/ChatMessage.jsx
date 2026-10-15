import React, { useState } from "react";
import { User, Bot, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./ChatMessage.module.css";

const ChatMessage = ({ role, content }) => {
  const [copied, setCopied] = useState(false);

  // Helper utility to safely trigger Clipboard APIs (Bonus Feature)
  const handleCopyText = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset state after 2 seconds
    } catch (err) {
      console.error("Failed to copy content to clipboard: ", err);
    }
  };

  return (
    <div className={`${styles.message} ${styles[role]}`}>
      <div className={`${styles.avatar} ${styles[role]}`}>
        {role === "user" ? (
          <User size={18} color="white" />
        ) : (
          <Bot size={18} color="white" />
        )}
      </div>

      <div className={styles.content}>
        {role === "user" ? (
          content
        ) : (
          <div className={styles.markdownBody}>
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const rawCodeString = String(children).replace(/\n\$/, "");

                  return !inline && match ? (
                    <div className={styles.codeBlockWrapper}>
                      {/* Code Block Header Layout with unique Copy Button */}
                      <div className={styles.codeHeader}>
                        <span className={styles.codeLanguage}>{match[1]}</span>
                        <button
                          className={styles.innerCopyBtn}
                          onClick={() => handleCopyText(rawCodeString)}
                        >
                          {copied ? (
                            <Check size={14} color="#10b981" />
                          ) : (
                            <Copy size={14} />
                          )}
                          <span>{copied ? "Copied!" : "Copy code"}</span>
                        </button>
                      </div>

                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {rawCodeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Global Quick-Click Copy Action Box for the entire text block */}
      {role === "assistant" && (
        <div className={styles.globalActionContainer}>
          <button
            className={styles.messageActionBtn}
            onClick={() => handleCopyText(content)}
            title="Copy message to clipboard"
          >
            {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
          </button>
        </div>
      )}
    </div>
  );
};

// Exporting at the bottom to remain matching your preferred pattern rules
export default ChatMessage;
