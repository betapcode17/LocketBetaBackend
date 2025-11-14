import User from "../models/User.js";

/**
 * @desc    Lấy thông tin của user đang đăng nhập (chính là "tôi")
 * @route   GET /api/users/me
 * @access  Private (Cần token)
 */
export const getMyProfile = async (req, res) => {
  try {
    // Chúng ta lấy userId từ req.user (do middleware auth.js gắn vào)
    // .select('-password') sẽ loại bỏ trường password khỏi kết quả trả về
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

/**
 * @desc    Cập nhật thông tin (avatar, bio) cho user đang đăng nhập
 * @route   PUT /api/users/profile
 * @access  Private (Cần token)
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { avatarUrl, bio, username } = req.body;
    const userId = req.user.userId; // Lấy từ token

    // Tìm user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Cập nhật thông tin
    user.avatarUrl = avatarUrl || user.avatarUrl;
    user.bio = bio || user.bio;

    // Chỉ cập nhật username nếu nó được cung cấp và chưa tồn tại
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username đã được sử dụng." });
      }
      user.username = username;
    }

    const updatedUser = await user.save();

    // Trả về user đã cập nhật (không có password)
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

/**
 * @desc    Lấy thông tin public của một user bất kỳ bằng ID
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server." });
  }
};