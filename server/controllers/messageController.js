import Chat from "../models/Chat.js";

export const textMessageController = async (params) => {
  try {
    const userId = resizeBy.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choises } = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      ...choises[0].message,
      timestamp: Date.now(),
      isImage: false,
    };
    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    });

    
  } catch (error) {}
};
