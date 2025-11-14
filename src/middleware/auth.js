import jwt from "jsonwebtoken";

// Đọc JWT_SECRET từ file .env.
// Nếu không có, dùng "secretkey" làm dự phòng (nhưng bạn NÊN ĐẶT NÓ trong .env)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware này sẽ kiểm tra JWT token từ header 'Authorization'.
 * Nếu hợp lệ, nó sẽ gắn thông tin user (ví dụ: { userId: '...'}) vào req.user
 * và cho phép request đi tiếp.
 */
export const auth = (req, res, next) => {
  try {
    // Lấy token từ header. Định dạng: "Bearer <token>"
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Không có token, không thể xác thực." });
    }

    // Giải mã token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Gắn payload đã giải mã (chứa userId) vào req.user
    // Giờ đây, tất cả các route được bảo vệ đều có thể truy cập req.user
    req.user = decoded; // decoded chứa { userId: user._id, email: user.email }

    // Cho phép request đi tiếp tới controller
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ." });
  }
};

 