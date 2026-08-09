const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const { connectDB, getDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

console.log(
  "OpenRouter Key Loaded:",
  !!process.env.OPENROUTER_API_KEY
);

// ===============================
// CHAT API
// ===============================

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "Please enter a message.",
      });
    }

    console.log("User:", message);

    // Start timer
    console.time("AI Response");

    // ===============================
    // OPENROUTER API
    // ===============================

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // End timer
    console.timeEnd("AI Response");

    const reply =
      response.data.choices[0].message.content;

    console.log("Bot:", reply);

    // ===============================
    // SAVE MESSAGE TO MONGODB
    // ===============================

    const db = getDB();

    await db.collection("messages").insertOne({
      user: message,
      bot: reply,
      createdAt: new Date(),
    });

    console.log("✅ Message saved to MongoDB");

    // ===============================
    // SEND RESPONSE TO FRONTEND
    // ===============================

    res.json({
      reply: reply,
    });

  } catch (error) {

    console.log("========== ERROR ==========");

    console.log(
      "Message:",
      error.message
    );

    if (error.response) {

      console.log(
        "Status:",
        error.response.status
      );

      console.log(
        "Data:",
        JSON.stringify(
          error.response.data,
          null,
          2
        )
      );
    }

    console.log(
      "==========================="
    );

    res.status(500).json({
      reply: "Server Error",
    });
  }
});

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// ===============================
// START SERVER
// ===============================

async function startServer() {

  try {

    // Connect MongoDB first
    await connectDB();

    const PORT =
      process.env.PORT || 5000;

    app.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();