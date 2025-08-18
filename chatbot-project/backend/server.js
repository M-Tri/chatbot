// backend/server.js
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Route to handle chat requests
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-r1:1.5b",
        prompt: userMessage,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ reply: data.response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Error: could not reach Ollama backend." });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
