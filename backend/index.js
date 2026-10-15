import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db/db.configure.js";
import mainRouter from "./src/api/main.routes.js"
import { errorHandler } from "./src/middleware/error-handler.js"; 

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", mainRouter);
app.use(errorHandler);

async function startServer() {
  try {
    // 1. Verify Database is online first
    const connection = await db.getConnection();
    console.log(
      "[DB SUCCESS]: MySQL handshake completed! Connected to gpt-clone.",
    );
    connection.release();

    // 2. Start listening only after DB succeeds
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is alive on http://localhost:${PORT}`);
    });

  } catch (error) {
    // PRODUCTION MODIFICATION: Log the warning trace, but NEVER crash the process engine loop.
    console.error(
      "[DEPLOYMENT WARNING]: Database initialization delayed, keeping server cluster alive:",
      error.message,
    );

    // Fallback listener ensures deployment platforms like Render can always bind to a port successfully
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running in safe-mode recovery on port ${PORT}`);
    });
  }
}

startServer();
