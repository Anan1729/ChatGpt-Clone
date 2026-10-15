/**
 * Trims and sanitizes incoming raw LLM responses
 * to ensure uniform layout structures.
 * @param {string} text
 * @returns {string} Cleaned text string
 */
const sanitizeAiResponse = (text) => {
  if (!text || typeof text !== "string") return "";

  return (
    text
      .trim()
      // Removes hidden glitch spaces or zero-width spaces if they exist
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
  );
};

export { sanitizeAiResponse };
