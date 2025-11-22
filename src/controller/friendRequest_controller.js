import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";

export const getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ toUser: req.params.userId, status: "pending" })
      .populate("fromUser", "username avatarUrl")
      .exec();

    res.status(200).json(requests.map(r => ({
      id: r._id,
      fromUserId: r.fromUser._id,
      username: r.fromUser.username,
      avatarUrl: r.fromUser.avatarUrl,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "accepted";
    await request.save();

    // Tạo record Friend cho cả 2 bên
    await Friend.create({ userId: request.fromUser, friendId: request.toUser });
    await Friend.create({ userId: request.toUser, friendId: request.fromUser });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { fromUser, toUser } = req.body;
    const exists = await FriendRequest.findOne({ fromUser, toUser, status: "pending" });
    if (exists) return res.status(400).json({ message: "Request already sent" });

    const newRequest = new FriendRequest({ fromUser, toUser });
    await newRequest.save();

    res.status(201).json({ message: "Friend request sent", id: newRequest._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
