import {
  createConversationService,
  getConversationsService,
  clearConversationsService,
} from "../service/chat.service.js";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-lite";
const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Step 3: Handle incoming POST requests
const createConversationController = async (req, res, next) => {
  try {
    const { question } = req.body;

    const result = await createConversationService(question);

    res.status(201).json({
      success: true,
      message: "Conversation posted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Step 4: Handle incoming GET requests
const getConversationsController = async (req, res, next) => {
  try {
    const data = await getConversationsService();

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const clearConversationsController = async (req, res, next) => {
  try {
    const result = await clearConversationsService();
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// Exporting the functions together at the bottom
export {
  createConversationController,
  getConversationsController,
  clearConversationsController
};
