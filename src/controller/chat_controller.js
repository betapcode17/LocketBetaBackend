import Chat from'../models/Chat.js';
import '../models/Message.js';
import '../models/User.js'

export const getAllChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: 'UserId is required' });

    const chats = await Chat.find({ members: userId })
      .populate('members', 'username avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username avatar' }
      })
      .sort({ updatedAt: -1 })
      .lean();
    // console.log(chats);
    return res.json({ chats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

