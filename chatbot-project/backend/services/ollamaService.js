import { OLLAMA_URL } from "../config.js";

export async function createChatStream({ model, messages, temperature }) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      options: {
        temperature: Number(temperature)
      },
      stream: true
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(
      `Ollama returned ${response.status}. ${errorText || "Check the model name and Ollama server."}`
    );
    error.status = response.status;
    throw error;
  }

  return response.body;
}

export async function* readOllamaTokens(stream) {
  const decoder = new TextDecoder();
  let buffer = "";

  for await (const chunk of stream) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;

      const data = JSON.parse(line);
      if (data.message?.content) yield data.message.content;
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) {
    const data = JSON.parse(buffer);
    if (data.message?.content) yield data.message.content;
  }
}
