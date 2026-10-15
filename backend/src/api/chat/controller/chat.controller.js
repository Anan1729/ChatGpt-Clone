import {
  createConversationService,
  getConversationsService,
  clearConversationsService,
  createNewSessionService,
  getAllSessionsService,
  getSessionMessagesService,
  deleteSingleSessionService,
} from "../service/chat.service.js";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-lite";
const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Step 3: Handle incoming POST requests
const createConversationController = async (req, res, next) => {
  try {
    const { question, sessionId } = req.body;


        const result = await createConversationService(question, sessionId);

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

// Handle creating a blank new chat thread session
const createNewSessionController = async (req, res, next) => {
  try {
    const result = await createNewSessionService();
    res.status(201).json({
      success: true,
      message: "New chat session created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Handle fetching all historical chat sessions for the sidebar
const getAllSessionsController = async (req, res, next) => {
  try {
    const data = await getAllSessionsService();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

//  Handle fetching all messages inside one specific chat session
const getSessionMessagesController = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const data = await getSessionMessagesService(sessionId);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

// Handle deleting a single specific chat session via sidebar trash icon
const deleteSingleSessionController = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const result = await deleteSingleSessionService(sessionId);
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
  clearConversationsController,
  createNewSessionController,
  getAllSessionsController,
  getSessionMessagesController,
  deleteSingleSessionController,
};
