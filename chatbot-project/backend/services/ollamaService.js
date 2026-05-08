import { OLLAMA_URL } from "../config.js";

export async function generateReply({ model, prompt, temperature }) {
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      options: {
        temperature: Number(temperature)
      },
      stream: false
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

  const data = await response.json();
  return data.response;
}
