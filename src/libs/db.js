import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("kết nối cơ sở dữ liệu thành công");
  } catch (error) {
    console.error("Kết nối CSDL thất bại", error);
    process.exit(1);
  }
};

export default connectDB;
