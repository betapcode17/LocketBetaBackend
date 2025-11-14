import express from "express";
import {
  getMyProfile,
  updateUserProfile,
  getUserById,
} from "../controller/user_controller.js";
import { auth } from "../middleware/auth.js"; // <-- Import "người gác cổng"

const router = express.Router();

// @route   GET /api/users/me
// @desc    Lấy thông tin của "tôi". Phải đi qua "người gác cổng" (auth) trước.
router.get("/me", auth, getMyProfile);

// @route   PUT /api/users/profile
// @desc    Cập nhật thông tin của "tôi". Phải đi qua "người gác cổng" (auth) trước.
router.put("/profile", auth, updateUserProfile);

// @route   GET /api/users/:id
// @desc    Xem thông tin public của người khác (không cần gác cổng)
router.get("/:id", getUserById);

export default router;