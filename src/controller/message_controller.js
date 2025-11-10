import Message from'../models/Message.js';
import Chat from'../models/Chat.js';

//lấy toàn bộ messages
export const getAllMessages = async (req, res) => {
    const chatId = req.params.chatId;
    if (!chatId) return res.status(400).json({ error: 'chatId is required' });

    try {
        const messages = await Message.find({chatId : chatId})
            .populate('sender', 'username avatar')
            .sort({createdAt: 1});
        console.log("Messages: " + messages);
        return res.json(messages);
    } catch (e) {
        return res.status(500).json({ error: err.message });
    }
}

//xóa message
export const deleteMessage = async (req, res) => {
    const messageId = req.params.messageId || req.body.messageId;
    if(!messageId)
        return res.status(403).json({error: 'messageId is required'});
    try {
        const msg = await Message.findById(messageId).lean();
        if(!msg)
            return res.status(404).json({ error: 'Message not found' });
        // Optional: kiểm tra quyền (nếu client gửi userId hoặc bạn có middleware auth)
        const requester = req.body.userId || req.query.userId;
        if (requester && String(msg.sender) !== String(requester)) {
        return res.status(403).json({ error: 'Not allowed to delete this message' });
        }

        await Message.findByIdAndDelete(messageId);

        const chat = await Chat.findById(msg.chatId).select('lastMessage').lean();
        if (chat && String(chat.lastMessage) === String(messageId)) {
        const last = await Message.findOne({ chatId: msg.chatId }).sort({ createdAt: -1 }).select('_id').lean();
        await Chat.findByIdAndUpdate(msg.chatId, { lastMessage: last ? last._id : null, updatedAt: new Date() });
        }

        return res.json({ status: 200, messageId });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//chỉnh sửa message
export const updatedMessage = async (req, res) => {
    const messageId = req.params.messageId || req.body.messageId;
    if(!messageId)
        return res.status(403).json({error: 'messageId is required'});

    const { content } = req.body;
    if (!content && typeof content !== 'string') {
        return res.status(400).json({ error: 'content is required' });
    }

    try {
        const msg = await Message.findById(messageId).lean();
        if(!msg)
            return res.status(404).json({ error: 'Message not found' });
        // Optional: kiểm tra quyền (nếu client gửi userId hoặc bạn có middleware auth)
        const requester = req.body.userId || req.query.userId;
        if (requester && String(msg.sender) !== String(requester)) {
        return res.status(403).json({ error: 'Not allowed to delete this message' });
        }

        const update = { content };
        await Message.findByIdAndUpdate(messageId, {
            content: update
        });

        return res.json({ status: 200, messageId });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

//connect với websocket
export const handleWsConnection = async (ws, req, wss, webSockets) => {
    
    let userID = null;
    try {
        const fullUrl = new URL(req.url, `http://${req.headers.host}`);
        userID = fullUrl.searchParams.get('userId');
    } catch (e) {
        const match = (req.url || '').match(/[?&]userId=([^&]+)/);
        if (match) userID = decodeURIComponent(match[1]);
    }

    if (!userID) {
        ws.close(1008, 'Missing userId');
        return;
    }
    webSockets[userID] = ws; //thêm người dùng mới vào danh sách đang online
    console.log('User ' + userID + ' Connected');

    ws.on("message", async (message) => {
        //if there is any message
        console.log("Message: " + message);
        var datastring = message.toString();
        try {
            var data = JSON.parse(datastring);
        } catch (error) {
            ws.send(JSON.stringify({status : 'error', reason: 'invalid_json'}));
        }

        // // Expect shape: { action: 'send', chatId: '...', content: '...', type?: 'text' }
        // if (data.action !== 'send') {
        //     ws.send(JSON.stringify({ status: 'error', reason: 'unsupported_action' }));
        //     return;
        // }

        try {
            const { chatId, content, type = 'text' } = data;
            if (!chatId || !content) {
                ws.send(JSON.stringify({ status: 'error', reason: 'missing_fields' }));
                return;
            }

            // TODO: validate auth / permission that userID is member of chatId

            // Save message using existing Message schema (chatId, sender, content, type, createdAt)
            const saved = await Message.create({
                chatId,
                sender: userID,
                content,
                type,
                createdAt: new Date()
            });

            // Update chat.lastMessage and updatedAt
            await Chat.findByIdAndUpdate(chatId, { lastMessage: saved._id, updatedAt: new Date() }).catch(() => {});

            // Populate sender small payload
            const populated = await Message.findById(saved._id).populate('sender', 'name avatar').lean();

            // Broadcast to all connected members of the chat if known, else send only to sender
            const chat = await Chat.findById(chatId).select('members').lean().catch(() => null);
            const payload = JSON.stringify({ event: 'message', message: populated });

            if (chat && Array.isArray(chat.members)) {
                for (const memberId of chat.members) {
                const client = webSockets[String(memberId)];
                if (client && client.readyState === 1) { // 1 = OPEN
                    client.send(payload);
                }
                }
            } else {
                // no chat member list => at least ack to sender
                ws.send(payload);
            }

            // ack to the sender with saved id
            ws.send(JSON.stringify({ status: 'ok', messageId: saved._id }));
        } catch (err) {
        console.error('ws message handler error:', err);
        ws.send(JSON.stringify({ status: 'error', reason: err.message }));
        }
    });

    ws.on("close", function () {
        delete webSockets[userID];
        console.log("User Disconnected: " + userID);
    });

    ws.send(JSON.stringify({ status: 'connected', userId: userID }));
};
