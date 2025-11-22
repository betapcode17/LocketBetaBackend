import express from "express";
import {
  createPhoto,
  getAllPhotos,
  getDetailPhoto,
  deletePhoto,
  getPhotosByUserId,
} from "../controller/photo_controller.js"; // Sửa path nếu cần

const router = express.Router();

// create photo
router.post("/", createPhoto);

//get photos by userId
router.get("/user/:userId", getPhotosByUserId);

// get all photos (with pagination)
router.get("/", getAllPhotos);

// get detail photo
router.get("/:id", getDetailPhoto);

// delete photo
router.delete("/:id", deletePhoto);


export default router;
