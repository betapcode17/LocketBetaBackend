import Friend from "../models/Friend.js";
import User from "../models/User.js"; 

export const getFriends = async (req, res) => {
  try {
    const friends = await Friend.find({ userId: req.params.userId })
      .populate("friendId", "name profileImage") 
      .exec();

    const friendList = friends.map(f => ({
      id: f._id,
      userId: f.userId,
      friendId: f.friendId._id,
      name: f.friendId.name,
      profileImage: f.friendId.profileImage,
      isActive: f.isActive,
      lastSeen: f.lastSeen,
    }));

    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const exists = await Friend.findOne({ userId, friendId });
    if (exists) {
      return res.status(400).json({ message: "Friend already added" });
    }

    const newFriend = new Friend({ userId, friendId });
    await newFriend.save();

    await newFriend.populate("friendId", "name profileImage");

    res.status(201).json({
      id: newFriend._id,
      userId: newFriend.userId,
      friendId: newFriend.friendId._id,
      name: newFriend.friendId.name,
      profileImage: newFriend.friendId.profileImage,
      isActive: newFriend.isActive,
      lastSeen: newFriend.lastSeen,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    await Friend.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Friend removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
