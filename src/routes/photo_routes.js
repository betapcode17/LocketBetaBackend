import express from "express";
import {
  createPhoto,
  getAllPhotos,
  getDetailPhoto,
  deletePhoto,
} from "../controller/photo_controller.js"; // Sửa path nếu cần

const router = express.Router();

// create photo
router.post("/", createPhoto);

// get all photos (with pagination)
router.get("/", getAllPhotos);

// get detail photo
router.get("/:id", getDetailPhoto);

// delete photo
router.delete("/:id", deletePhoto);

export default router;
