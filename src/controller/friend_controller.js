// import Friend from "../models/Friend.js";
// import User from "../models/User.js"; 

// export const getFriends = async (req, res) => {
//   try {
//     const friends = await Friend.find({ userId: req.params.userId })
//       .populate("friendId", "name profileImage") 
//       .exec();

//     const friendList = friends.map(f => ({
//       id: f._id,
//       userId: f.userId,
//       friendId: f.friendId._id,
//       name: f.friendId.name,
//       profileImage: f.friendId.profileImage,
//       isActive: f.isActive,
//       lastSeen: f.lastSeen,
//     }));

//     res.status(200).json(friendList);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const addFriend = async (req, res) => {
//   try {
//     const { userId, friendId } = req.body;

//     const exists = await Friend.findOne({ userId, friendId });
//     if (exists) {
//       return res.status(400).json({ message: "Friend already added" });
//     }

//     const newFriend = new Friend({ userId, friendId });
//     await newFriend.save();

//     await newFriend.populate("friendId", "name profileImage");

//     res.status(201).json({
//       id: newFriend._id,
//       userId: newFriend.userId,
//       friendId: newFriend.friendId._id,
//       name: newFriend.friendId.name,
//       profileImage: newFriend.friendId.profileImage,
//       isActive: newFriend.isActive,
//       lastSeen: newFriend.lastSeen,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const removeFriend = async (req, res) => {
//   try {
//     await Friend.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Friend removed" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// thêm bạn trực tiếp
export const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // kiểm tra đã là bạn chưa
    const exists = await Friend.findOne({ userId, friendId });
    if (exists) {
      return res.status(400).json({ error: "Friend already added" });
    }

    const newFriend = new Friend({ userId, friendId });
    await newFriend.save();

    // populate thông tin bạn bè
    const friendUser = await User.findById(friendId);

    res.status(201).json({
      id: newFriend._id,
      userId: newFriend.userId,
      friendId: newFriend.friendId,
      name: friendUser?.username || "Unknown",
      profileImage: friendUser?.avatarUrl || null,
      isActive: friendUser?.isActive || false,
      lastSeen: friendUser?.lastSeen || new Date(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// lấy danh sách bạn bè
export const getFriends = async (req, res) => {
  try {
    const userId = req.params.userId;

    const friends = await Friend.find({ userId });

    const result = await Promise.all(
      friends.map(async (f) => {
        const user = await User.findById(f.friendId);

        return {
          id: f.friendId,
          name: user?.name || "Unknown",
          profileImage: user?.profileImage || null,
          isActive: user?.isActive || false,
          lastSeen: user?.lastSeen || new Date(),
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// lấy danh sách yêu cầu kết bạn (đã FIX)
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.params.userId;

    const requests = await FriendRequest.find({
      receiverId: userId,
      status: "pending",
    });

    const result = await Promise.all(
      requests.map(async (reqItem) => {
        const sender = await User.findById(reqItem.senderId);

        return {
          id: reqItem._id.toString(),
          senderId: reqItem.senderId,
          name: sender?.name || "Unknown",
          profileImage: sender?.profileImage || null,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// gửi lời mời kết bạn
export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const exists = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    });

    if (exists) {
      return res.status(400).json({ error: "Already sent" });
    }

    const newRequest = new FriendRequest({ senderId, receiverId });
    await newRequest.save();

    res.json({ message: "Request sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: "Not found" });

    request.status = "accepted";
    await request.save();

    // add friend both sides
    await Friend.create({
      userId: request.senderId,
      friendId: request.receiverId,
    });
    await Friend.create({
      userId: request.receiverId,
      friendId: request.senderId,
    });

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// reject request
export const rejectFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    await FriendRequest.findByIdAndDelete(requestId);

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// lấy danh sách gợi ý kết bạn
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // lấy tất cả người dùng trừ bản thân và những người đã là bạn
    const friends = await Friend.find({ userId });
    const friendIds = friends.map(f => f.friendId.toString());

    const users = await User.find({
      _id: { $nin: [userId, ...friendIds] }
    }).limit(10); // giới hạn 10 người gợi ý

    const result = users.map(u => ({
      id: u._id,
      name: u.username || "Unknown",
      profileImage: u.avatarUrl || null,
      isActive: u.isActive || false,
      lastSeen: u.lastSeen || new Date(),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


