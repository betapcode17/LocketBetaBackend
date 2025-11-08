import express from "express";
import {
  createPost,
  getAllPosts,
  getDetailPost,
  deletePost,
} from "../controller/post_controller.js";

const router = express.Router();

// create post
router.post("/", createPost);

// get all posts (with pagination)
router.get("/", getAllPosts);

// get detail post
router.get("/:id", getDetailPost);

// delete post
router.delete("/:id", deletePost);

export default router;
