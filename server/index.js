const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const { connectDB, getDB } = require("./db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

console.log(
  "OpenRouter Key Loaded:",
  !!process.env.OPENROUTER_API_KEY
);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User:", message);

    // ⏱ Start timer
    console.time("AI Response");

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

    // ⏱ End timer
    console.timeEnd("AI Response");

    const reply = response.data.choices[0].message.content;

const db = getDB();

await db.collection("messages").insertOne({
  user: message,
  bot: reply,
  createdAt: new Date(),
});

    console.log("Bot:", reply);

    res.json({
      reply: reply,
    });

  } catch (error) {

    console.log("========== ERROR ==========");
    console.log("Message:", error.message);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log(
        "Data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }

    console.log("===========================");

    res.status(500).json({
      reply: "Server Error",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});