import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

const connectDB = async () => {
  try {
    // Dùng biến môi trường để kết nối
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/LocketBeta';
    await mongoose.connect(uri);

    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Thoát khỏi quy trình (process) với lỗi
    process.exit(1);
  }
};

export default connectDB;