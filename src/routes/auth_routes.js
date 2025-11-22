import express from "express";
import { register, login, refresh } from "../controller/auth_controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;