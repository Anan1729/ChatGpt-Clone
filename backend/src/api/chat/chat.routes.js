// src/api/chat/chat.routes.js
import express from "express";
// Import your controller function
import {
  createConversationController,
  getConversationsController,
  clearConversationsController,
} from "./controller/chat.controller.js";

const chatRouter = express.Router();

// Define your target chat endpoints
chatRouter.post("/conversations", createConversationController);
chatRouter.get("/conversations", getConversationsController);
chatRouter.delete("/conversations", clearConversationsController);

// This is the crucial line your mainRouter is looking for!
export default chatRouter;
