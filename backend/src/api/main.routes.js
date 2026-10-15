import express from "express";
import chatRouter from "./chat/chat.routes.js";


const mainRouter = express.Router();

// Mounts all chat routes under the prefix '/chat'
mainRouter.use("/chat", chatRouter);

export default mainRouter;
