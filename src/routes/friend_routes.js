import express from "express";
import { getFriends, addFriend, removeFriend } from "../controller/friend_controller.js";

const router = express.Router();

router.get("/:userId", getFriends);
router.post("/add", addFriend);
router.delete("/:id", removeFriend);

export default router;
