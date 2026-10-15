# 🤖 ChatGPT Clone (Full-Stack Gemini Workspace)

A production-ready, full-stack ChatGPT clone featuring a highly responsive React frontend UI and a robust Node.js/Express backend anchored by a MySQL database. Powered securely by Google's **Gemini 3 Flash** artificial intelligence engine.

### 🌐 [Click Here to View the Live Application](https://netlify.app) 🚀

---

## 🌟 Key Features

### 🎨 Frontend UI & Visual Polish
* **Dynamic Personalized Greeting:** Greets users with a custom, centered welcome screen layout (**"Hello, IT"**) when conversation logs are cleared.
* **Pill-Rounded Oval Constraints:** The message input bar features a spacious, continuous oval-rounded design matching native layout dimensions.
* **Suggested Prompt Quick-Cards:** Responsive starter query blocks display automatically on empty canvases to guide user interactions.
* **Markdown & Syntax Highlighting:** Renders rich text layouts fluidly, parsing complex coding blocks into dedicated, colored console cells.
* **Hover Copy Action Handles:** Includes sleek micro-buttons that appear on hover to copy full responses or code fields to the clipboard instantly.
* **Autoscroll Lock Engine:** Keeps the screen focused on generating words smoothly, but locks window coordinates in place if you scroll up manually.
* **Collapsible Sidebar Drawer:** Implements an adjustable side panel containing a fully working **"New chat"** button.

### ⚙️ Backend Architecture & Business Logic
* **Conversational History Memory:** Stored chats are read chronologically from MySQL and fed back to Gemini, giving the bot deep context memory.
* **Statistical Tokenizer Utilities:** Uses an optimized script (`utils/tokenizer.js`) to estimate token footprints and track weights inside the database.
* **Resilient Startup & Exception Chains:** Features an advanced `errorHandler` that serves orderly JSON logs to your frontend without ever crashing the main server process during external traffic spikes.
* **Environment Variable Safety:** Sensitive API keys and credentials stay completely hidden in local `.env` frameworks.
* **Concurrently Orchestrated Commands:** Runs both backend database handshakes and frontend Vite streams at the exact same time through one terminal tab (`npm run dev`).

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite), Lucide React, React Markdown, React Syntax Highlighter
* **Backend:** Node.js, Express, Cors, Dotenv, Google Gen AI SDK
* **Database:** MySQL (with connection pooling via `mysql2/promise`)
* **Dev Environment:** Concurrently

---

## 🚀 Installation & Local Configuration

### 1. Database Initialization
Run this script within your local MySQL environment to create your tables and storage properties:
```sql
CREATE DATABASE IF NOT EXISTS `gpt-clone`;
USE `gpt-clone`;

CREATE TABLE IF NOT EXISTS conversations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role ENUM('user', 'assistant') NOT NULL,
    content TEXT NOT NULL,
    token_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Setting Up Environment Files
Create a file named `.env` right inside your `/backend` folder and add your project keys:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=gpt-clone
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3-flash
```

### 3. Launching Your Application
Go to your project's root folder in your terminal and install the root workspace components:
```bash
npm install
```
Flick on your full-stack environment using your unified shortcut command:
```bash
npm run dev
```
* Your backend API will handle routes on: `http://localhost:5000`
* Your Vite frontend shell will open on: `http://localhost:5173`

---

## 🔒 Security & Git Practices
The configuration parameters for this project utilize standard `.gitignore` rules to keep development caches (`node_modules/`), compiled distributions (`dist/`), and private credentials (`.env`) safely stored locally on your machine and never leaked onto your public git history.

---

## 📄 Disclaimer & Fair Use Notice

This project is a non-commercial, open-source **educational clone** created strictly for portfolio, learning, and demonstration purposes. 

* **ChatGPT** and its logo/design style are registered trademarks of OpenAI. This project is not affiliated with, endorsed by, or associated with OpenAI in any capacity.
* This code serves as a personal demonstration of full-stack engineering skills, showcasing the implementation of relational database storage, asynchronous middleware pipelines, custom tokenization models, and UI state synchronization.

**Created by Anan1729 — 2026**
