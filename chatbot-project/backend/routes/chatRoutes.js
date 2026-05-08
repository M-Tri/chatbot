import { Router } from "express";
import {
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  OLLAMA_URL
} from "../config.js";
import { generateReply } from "../services/ollamaService.js";

const router = Router();

function buildPrompt(message, systemPrompt = "") {
  return systemPrompt?.trim()
    ? `${systemPrompt.trim()}\n\nUser: ${message}`
    : message;
}

router.get("/config", (_req, res) => {
  res.json({
    model: DEFAULT_MODEL,
    temperature: DEFAULT_TEMPERATURE,
    ollamaUrl: OLLAMA_URL
  });
});

router.post("/chat", async (req, res) => {
  const {
    message,
    model = DEFAULT_MODEL,
    temperature = DEFAULT_TEMPERATURE,
    systemPrompt = ""
  } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const reply = await generateReply({
      model,
      temperature,
      prompt: buildPrompt(message, systemPrompt)
    });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.status
        ? err.message
        : "Could not reach Ollama. Make sure Ollama is running."
    });
  }
});

export default router;
