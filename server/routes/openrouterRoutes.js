import express from "express";
import { askOpenRouter } from "../services/openrouter.js";

const router = express.Router();
router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content || "Нет ответа от модели";

    if (!response.ok) {
      return res.status(response.status).json({ error: answer });
    }

    res.json({ answer });
  } catch (err) {
    console.error("Ошибка:", err);
    res.status(500).json({ error: "Ошибка при обращении к OpenRouter" });
  }
});


export default router;
