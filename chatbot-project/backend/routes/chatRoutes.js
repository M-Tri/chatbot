import { Router } from "express";
import {
  DEFAULT_MODEL,
  DEFAULT_TEMPERATURE,
  OLLAMA_URL
} from "../config.js";
import { createChatStream, readOllamaTokens } from "../services/ollamaService.js";

const router = Router();
const DEFAULT_SYSTEM_PROMPT = "Reply naturally. Do not wrap the whole answer in quotes. Do not include hidden reasoning, XML tags, or markdown unless asked.";

function buildMessages(message, systemPrompt = "", history = []) {
  const messages = [
    {
      role: "system",
      content: systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT
    }
  ];

  const recentHistory = history
    .filter((item) => item.role === "user" || item.role === "assistant")
    .slice(-8);

  messages.push(...recentHistory);
  messages.push({ role: "user", content: message });

  return messages;
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
    systemPrompt = "",
    history = []
  } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const stream = await createChatStream({
      model,
      temperature,
      messages: buildMessages(message, systemPrompt, history)
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Content-Type-Options", "nosniff");

    for await (const token of readOllamaTokens(stream)) {
      res.write(token);
    }

    res.end();
  } catch (err) {
    console.error(err);

    if (res.headersSent) {
      res.end();
      return;
    }

    res.status(err.status || 500).json({
      error: err.status
        ? err.message
        : "Could not reach Ollama. Make sure Ollama is running."
    });
  }
});

export default router;
