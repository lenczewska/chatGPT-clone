import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import authRouter from "./routes/authRoutes.js";
import openrouterRouter from "./routes/openrouterRoutes.js";

dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
});

const app = express();

connectDB();

await connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/openrouter", openrouterRouter);

app.use("/api/auth", authRouter);
app.get("/", (req, res) => res.send("Server is live!"));
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
