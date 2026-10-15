import express from "express";
// Import your controller function
import {
  createConversationController,
  getConversationsController,
  clearConversationsController,
  // Necessary imports for session thread handling
  createNewSessionController,
  getAllSessionsController,
  getSessionMessagesController,
  deleteSingleSessionController, // Imported function to handle single item trash deletion
} from "./controller/chat.controller.js";

const chatRouter = express.Router();

// Define your target chat endpoints
chatRouter.post("/conversations", createConversationController);
chatRouter.get("/conversations", getConversationsController);
chatRouter.delete("/conversations", clearConversationsController);

// Necessary endpoints added for session history action
chatRouter.post("/sessions/new", createNewSessionController);
chatRouter.get("/sessions", getAllSessionsController);
chatRouter.get("/sessions/:sessionId/messages", getSessionMessagesController);
chatRouter.delete("/sessions/:sessionId", deleteSingleSessionController); //  line added for the sidebar trash icon!

// This is the crucial line your mainRouter is looking for!
export default chatRouter;
