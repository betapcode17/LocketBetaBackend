import User from "../models/User.js";
import Friend from "../models/Friend.js";

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const friends = await Friend.find({ userId });
    const friendIds = friends.map(f => f.friendId.toString());
    
    const recommendations = await User.find({
      _id: { $ne: userId, $nin: friendIds }
    }).select("username avatarUrl");

    res.status(200).json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
