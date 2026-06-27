import Chat from "../models/Chat.js";

export const createChat = async (req, res) => {
  try {
    const { userId, userName, name, firstMessage } = req.body;

    const chat = new Chat({
      userId,
      userName,
      name,
      title: firstMessage ? firstMessage.slice(0, 32) : "Новый чат", // 👈 генерация названия
      messages: [],
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании чата" });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении чатов" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    await Chat.findByIdAndDelete(chatId);
    res.json({ message: "Чат удалён" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении чата" });
  }
};
