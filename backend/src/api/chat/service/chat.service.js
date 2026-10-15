import db from "../../../../db/db.configure.js";
import { GoogleGenAI } from "@google/genai";
import { estimateTokenCount } from "../../../Utils/tokenizer.js";
import { sanitizeAiResponse } from "../../../Utils/responseFormatter.js";
import crypto from "crypto";

// Step 1: Set up the production Gemini model targeting version 2.5
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-lite";

// Step 2: Initialize the official Google Gen AI client using your environment API key
const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Step 3: Helper utility to pull historical text logs out of your database tables for a specific session
const getRecentConversationRows = async (sessionId, limit = 5) => {
  const safeLimit = Number.isNaN(limit) || limit <= 0 ? 20 : limit;
  const [rows] = await db.execute(
    `SELECT id, session_id, role, content, token_count, created_at 
     FROM conversations 
     WHERE session_id = ?
     ORDER BY id DESC 
     LIMIT ?`,
    [sessionId, safeLimit],
  );
  return rows;
};

// Step 4: Core workflow engine function called by your controller layer
const createConversationService = async (question, sessionId) => {
  try {
    // Step 4a: Validate that the prompt exists and isn't empty blank space
    const activeText = question || "";

    if (!activeText || !activeText.trim()) {
      const error = new Error("Question content is required");
      error.status = 400;
      throw error;
    }

    if (!sessionId) {
      const error = new Error("Session ID is required to route message");
      error.status = 400;
      throw error;
    }

    // Step 4b: Retrieve the recent chat logs context from the database for this specific session
    const historyRows = await getRecentConversationRows(sessionId, 5);
    const chronologicalHistory = historyRows.reverse();

    // Estimate token count for user message before database entry
    const userTokens = estimateTokenCount(activeText);
    // Step 4c: Log the user's question into the MySQL database row stack with its session tag
    await db.execute(
      "INSERT INTO conversations (session_id, content, role, token_count) VALUES (?, ?, 'user', ?)",
      [sessionId, activeText, userTokens],
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

    // Step 4f: Log the generated assistant response back into your database rows under the same session
    await db.execute(
      "INSERT INTO conversations (session_id, content, role, token_count) VALUES (?, ?, 'assistant', ?)",
      [sessionId, botReply, aiTokens],
    );

    // Update the session's updated_at timestamp so it jumps to the top of the sidebar history list
    await db.execute(
      "UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [sessionId],
    );

    // If the session title is still 'New Chat', dynamically update it using the first message context
    const [sessionCheck] = await db.execute(
      "SELECT title FROM chat_sessions WHERE id = ?",
      [sessionId],
    );
    if (sessionCheck.length > 0 && sessionCheck[0].title === "New Chat") {
      const truncatedTitle =
        activeText.length > 30
          ? activeText.substring(0, 30) + "..."
          : activeText;
      await db.execute("UPDATE chat_sessions SET title = ? WHERE id = ?", [
        truncatedTitle,
        sessionId,
      ]);
    }

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

// Step 5: Service workflow to pull historical messages for the UI feed setup (Legacy / Fallback support)
const getConversationsService = async () => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM conversations ORDER BY id DESC LIMIT 20",
    );
    return rows.reverse();
  } catch (error) {
    throw error;
  }
};

const clearConversationsService = async () => {
  try {
    // Truncating the parent table cascade-wipes all conversation records simultaneously
    await db.execute("TRUNCATE TABLE chat_sessions");
    return { success: true, message: "History cleared successfully" };
  } catch (error) {
    throw error;
  }
};

// Service logic to instantiate an completely fresh conversation session row
const createNewSessionService = async () => {
  try {
    const newSessionId = "chat_" + crypto.randomBytes(8).toString("hex");
    const defaultTitle = "New Chat";

    await db.execute("INSERT INTO chat_sessions (id, title) VALUES (?, ?)", [
      newSessionId,
      defaultTitle,
    ]);

    return { sessionId: newSessionId, title: defaultTitle };
  } catch (error) {
    throw error;
  }
};

// Service logic to query master metadata for the dynamic historical sidebar
const getAllSessionsService = async () => {
  try {
    const [sessions] = await db.execute(
      "SELECT id, title, created_at, updated_at FROM chat_sessions ORDER BY updated_at DESC",
    );
    return sessions;
  } catch (error) {
    throw error;
  }
};

// Service logic to query chronologically correct tracking elements for an isolated conversation window
const getSessionMessagesService = async (sessionId) => {
  try {
    const [messages] = await db.execute(
      "SELECT id, role, content, token_count, created_at FROM conversations WHERE session_id = ? ORDER BY id ASC",
      [sessionId],
    );
    return messages;
  } catch (error) {
    throw error;
  }
};

// Service logic to handle dropping individual chat tree session lines via foreign keys
const deleteSingleSessionService = async (sessionId) => {
  try {
    await db.execute("DELETE FROM chat_sessions WHERE id = ?", [sessionId]);
    return { success: true, message: "Chat session deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Exporting the service functions together at the bottom
export {
  createConversationService,
  getConversationsService,
  clearConversationsService,
  createNewSessionService,
  getAllSessionsService,
  getSessionMessagesService,
  deleteSingleSessionService,
};
