import express from "express";
import {
  getFriends,
  addFriend,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  getRecommendations,
  rejectFriendRequest,
} from "../controller/friend_controller.js";

const router = express.Router();

router.get("/:userId", getFriends);
router.get("/requests/:userId", getFriendRequests);
router.get("/recommendation/:userId", getRecommendations);
router.post("/add", addFriend);
router.post("/request", sendFriendRequest);
router.put("/request/accept/:requestId", acceptFriendRequest);
router.put("/request/reject/:requestId", rejectFriendRequest);


export default router;
