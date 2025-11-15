import connectDB from '../config/database.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';

async function seed() {
  await connectDB();

  // Xoá dữ liệu cũ (tuỳ ý)
  await Promise.all([
    User.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({})
  ]);

  // Tạo user test (chú ý: cung cấp 'username' vì model yêu cầu)
  const users = await User.create([
    { username: 'alice', email: 'alice@test.local', password: 'pass' },
    { username: 'bob',   email: 'bob@test.local',   password: 'pass' }
  ]);

  // Tạo chat giữa 2 user
  const chat = await Chat.create({
    title: 'Test chat',
    members: users.map(u => u._id)
  });

  // Tạo vài message mẫu
  const messages = await Message.create([
    { chatId: chat._id, sender: users[0]._id, content: 'Hello Bob' },
    { chatId: chat._id, sender: users[1]._id, content: 'Hi Alice' }
  ]);

  await Chat.findByIdAndUpdate(chat._id, {
    lastMessage: messages[messages.length - 1]._id, // <-- ID của message cuối
    updatedAt: Date.now()
  });

  console.log('Seed finished:', {
    users: users.length,
    chatId: chat._id.toString(),
    messages: messages.length
  });

  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
