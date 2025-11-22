import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
});

export default mongoose.model("Friend", FriendSchema);
