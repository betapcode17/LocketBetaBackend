import Photo from "../models/photo.js";

// Lấy toàn bộ danh sách ảnh
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ timestamp: -1 });

    res.status(200).json({
      photos,
      total: photos.length,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách ảnh:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Tạo ảnh mới
export const createPhoto = async (req, res) => {
  try {
    const { userId, imageUrl, caption } = req.body;

    if (!userId || !imageUrl) {
      return res.status(400).json({ message: "Thiếu userId hoặc imageUrl" });
    }

    const newPhoto = await Photo.create({
      userId,
      imageUrl,
      caption,
    });

    res.status(201).json({
      message: "Tạo ảnh thành công",
      photo: newPhoto,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy ảnh theo _id (MongoDB tự tạo)
export const getDetailPhoto = async (req, res) => {
  try {
    const { id } = req.params; // id ở đây là _id
    const photo = await Photo.findById(id); // dùng findById

    if (!photo) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error("❌ Lỗi khi lấy chi tiết ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};

// Xóa ảnh theo _id
export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params; // id ở đây là _id
    const photo = await Photo.findByIdAndDelete(id);

    if (!photo) {
      return res.status(404).json({ message: "Ảnh không tồn tại" });
    }

    res.status(200).json({ message: "Xóa ảnh thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi xóa ảnh:", error);
    res.status(500).json({ message: error.message });
  }
};
