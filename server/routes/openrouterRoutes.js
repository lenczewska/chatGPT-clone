import express from "express";
import { askOpenRouter } from "../services/openrouter.js";

const router = express.Router();
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: "OpenRouter API key is not configured" });
  }

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const answer = await askOpenRouter(message);
    return res.json({ answer });
  } catch (err) {
    console.error("OpenRouter error:", err);
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || "Ошибка при обращении к OpenRouter" });
  }
});

export default router;
