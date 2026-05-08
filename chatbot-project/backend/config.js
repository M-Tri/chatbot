import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function loadEnvFile() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.join(dirname, ".env");

  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

export const PORT = Number(process.env.PORT || 3001);
export const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
export const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "deepseek-r1:1.5b";
export const DEFAULT_TEMPERATURE = Number(process.env.OLLAMA_TEMPERATURE || 0.7);
