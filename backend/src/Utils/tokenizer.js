/**
 * Estimates the token count of a given string based on
 * standard LLM character-to-token ratios.
 * @param {string} text
 * @returns {number} Estimated tokens
 */
const estimateTokenCount = (text) => {
  if (!text || typeof text !== "string") return 0;

  // Clean extra white spaces
  const cleanText = text.trim();
  if (cleanText === "") return 0;

  // Calculate based on the standard 4 characters per token rule
  const charBasedCount = Math.ceil(cleanText.length / 4);

  // Calculate based on the standard 0.75 words per token rule
  const words = cleanText.split(/\s+/);
  const wordBasedCount = Math.ceil(words.length / 0.75);

  // Take the average of both methods for a highly reliable estimate
  return Math.ceil((charBasedCount + wordBasedCount) / 2);
};

export { estimateTokenCount };
