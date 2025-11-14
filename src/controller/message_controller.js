const Message = require('../models/Message');
const Chat = require('../models/Chat');

exports.getAllMessagers = async (req, res) => {
    const chatId = req.body.chatId;
    if (!chatId) return res.status(400).json({ error: 'chatId is required' });

    try {
        const messages = await Message.find({chatId : chatId})
            .populate('sender', 'username avatarUrl')
            .sort({createdAt: 1});
        return res.json(messages);
    } catch (e) {988
        return res.status(500).json({ error: err.message });
    }
}