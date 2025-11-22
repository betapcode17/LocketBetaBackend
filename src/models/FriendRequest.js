// import mongoose from "mongoose";

// const FriendRequestSchema = new mongoose.Schema({
//   fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("FriendRequest", FriendRequestSchema);

import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("FriendRequest", FriendRequestSchema);
