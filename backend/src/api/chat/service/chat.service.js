import db from "../../../../db/db.configure.js";
import { GoogleGenAI } from "@google/genai";
import { estimateTokenCount } from "../../../Utils/tokenizer.js";
import { sanitizeAiResponse } from "../../../Utils/responseFormatter.js";

// Step 1: Set up the production Gemini model targeting version 2.5
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-lite";

// Step 2: Initialize the official Google Gen AI client using your environment API key
const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Step 3: Helper utility to pull historical text logs out of your database tables
const getRecentConversationRows = async (limit = 5) => {
  const safeLimit = Number.isNaN(limit) || limit <= 0 ? 20 : limit;
  const [rows] = await db.execute(
    `SELECT id, role, content, token_count, created_at 
     FROM conversations 
     ORDER BY id DESC 
     LIMIT ?`,
    [safeLimit],
  );
  return rows;
};

// Step 4: Core workflow engine function called by your controller layer
const createConversationService = async (question) => {
  try {
    // Step 4a: Validate that the prompt exists and isn't empty blank space
    const activeText = question || "";

    if (!activeText || !activeText.trim()) {
      const error = new Error("Question content is required");
      error.status = 400;
      throw error;
    }

    // Step 4b: Retrieve the recent chat logs context from the database
    const historyRows = await getRecentConversationRows(5);
    const chronologicalHistory = historyRows.reverse();

    // Estimate token count for user message before database entry
     const userTokens = estimateTokenCount(activeText);
    // Step 4c: Log the user's question into the MySQL database row stack
    await db.execute(
      "INSERT INTO conversations (content, role, token_count) VALUES (?, 'user', ?)",
      [activeText, userTokens],
    );

    // Format the history database logs so Gemini can actually read them as context
    const contentsPayload = chronologicalHistory.map((row) => ({
      role: row.role,
      parts: [{ text: row.content }],
    }));

    contentsPayload.push({
      role: "user",
      parts: [{ text: question }],
    });

    // Step 4d: Send the prompt parameter across the network to Google Gemini API
    const aiResponse = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: contentsPayload,
    });

    // Step 4e: Isolate the raw answer text string out of the Gemini object package
    const botReply = sanitizeAiResponse(aiResponse.text);

    // Estimate token count for assistant reply before database entry
    const aiTokens = estimateTokenCount(botReply);

    // Step 4f: Log the generated assistant response back into your database rows
    await db.execute(
      "INSERT INTO conversations (content, role, token_count) VALUES (?, 'assistant', ?)",
      [botReply, aiTokens],
    );

    // Step 4g: Return the text reply and status keys up to the route controller package
    return {
      reply: botReply,
      status: "AI response generated and logged successfully",
      tokensUsed: {
        user: userTokens,
        assistant: aiTokens,
        total: userTokens + aiTokens,
      },
    };
  } catch (error) {
    // Pass execution failures upward directly into the error middleware handler
    throw error;
  }
};

// Step 5: Service workflow to pull historical messages for the UI feed setup
const getConversationsService = async () => {
  try {
    // Fetch the last 20 total logs from the database
    const historyRows = await getRecentConversationRows(20);

    // Reverse the sequence so they display in chronological order from top to bottom
    return historyRows.reverse();
  } catch (error) {
    throw error;
  }
};

const clearConversationsService = async () => {
  try {
    await db.execute("TRUNCATE TABLE conversations"); // Completely empties the table safely
    return { success: true, message: "History cleared successfully" };
  } catch (error) {
    throw error;
  }
};
// Remember to add clearConversationsService to your export block at the bottom!

// Exporting the service functions together at the bottom
export {
  createConversationService,
  getConversationsService,
  clearConversationsService
};
