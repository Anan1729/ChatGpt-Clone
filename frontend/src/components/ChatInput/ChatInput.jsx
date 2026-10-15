import React, { useState } from "react";
import { Plus, Mic, ArrowUp, Sparkles, Code, Lightbulb } from "lucide-react";
import styles from "./ChatInput.module.css";

const ChatInput = ({
  handleSendMessage,
  isLoading,
  showSuggestions = true,
}) => {
  const [input, setInput] = useState("");

  // Sample quick-click starter prompts (Bonus Feature)
  const suggestions = [
    {
      text: "Explain APIs like I'm 5",
      icon: <Lightbulb size={16} color="#eab308" />,
    },
    {
      text: "Write a quick Python script to filter text",
      icon: <Code size={16} color="#3b82f6" />,
    },
    {
      text: "Give me 3 creative business ideas",
      icon: <Sparkles size={16} color="#10a37f" />,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    handleSendMessage(input.trim());
    setInput("");
  };

  const handleSuggestionClick = (promptText) => {
    if (isLoading) return;
    handleSendMessage(promptText);
  };

  return (
    <div className={styles.container}>
      {/* 1. Dynamic Suggested Prompt Cards displayed only on blank screens */}
      {showSuggestions && !input.trim() && (
        <div className={styles.suggestionsWrapper}>
          {suggestions.map((card, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.suggestionCard}
              onClick={() => handleSuggestionClick(card.text)}
              disabled={isLoading}
            >
              <div className={styles.cardHeader}>
                {card.icon}
                <span className={styles.cardText}>{card.text}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main message submission form element stack */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.icon}>
          <Plus size={20} />
        </div>

        <input
          type="text"
          className={styles.input}
          placeholder="Ask anything"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />

        {input.trim() ? (
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            <ArrowUp size={18} />
          </button>
        ) : (
          <div className={styles.icon}>
            <Mic size={20} />
          </div>
        )}
      </form>
    </div>
  );
};

// Exporting at the bottom to remain matching your preferred pattern rules
export default ChatInput;
