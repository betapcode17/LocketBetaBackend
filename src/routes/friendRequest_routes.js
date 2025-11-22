import express from "express";
import { 
  getFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  sendFriendRequest 
} from "../controller/friendRequest_controller.js";

const router = express.Router();

router.get("/:userId", getFriendRequests);
router.post("/", sendFriendRequest);
router.patch("/accept/:id", acceptFriendRequest);
router.patch("/reject/:id", rejectFriendRequest);

export default router;
