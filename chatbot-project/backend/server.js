import express from "express";
import cors from "cors";
import { DEFAULT_MODEL, OLLAMA_URL, PORT } from "./config.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(chatRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Using Ollama at ${OLLAMA_URL} with model ${DEFAULT_MODEL}`);
});
