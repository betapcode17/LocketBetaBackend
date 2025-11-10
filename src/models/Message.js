import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  type: { type: String, enum: ["text", "image"], default: "text" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', MessageSchema);
