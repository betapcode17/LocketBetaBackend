import Post from "../models/Post.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Lỗi khi gọi getAllPosts: ", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { userId, caption, imageUrl } = req.body;
    if (!userId || !imageUrl) {
      return res
        .status(400)
        .json({ message: "User ID và imageUrl là bắt buộc" });
    }
    const newPost = await Post.create({
      user: userId,
      caption,
      imageUrl,
    });
    res.status(201).json({ message: "Tạo post thành công", post: newPost });
  } catch (error) {
    console.error("Lỗi tạo post: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getDetailPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
