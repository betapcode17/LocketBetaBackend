import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: "Email or username existed" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Sign up successfully!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error when signup" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // create token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successfully!!!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error when login!!!" });
  }
};
