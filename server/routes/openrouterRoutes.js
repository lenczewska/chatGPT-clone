import express from "express";
import { askOpenRouter } from "../services/openrouter.js";

const router = express.Router();

router.post("/", async (req, res) => {
      console.log("BODY:", req.body); // проверка
  const { message } = req.body;
  try {
    const answer = await askOpenRouter(message);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при обращении к OpenRouter" });
  }
});

export default router;
