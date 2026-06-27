import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Новый чат", // 👈 название чата
    },
    messages: [
      {
        isImages: { type: Boolean, required: true },
        isPublished: { type: Boolean, default: false },
        role: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }, // 👈 исправлено на правильное свойство
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
