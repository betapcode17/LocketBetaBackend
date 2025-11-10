import express from 'express';
import * as controller from '../controller/chat_controller.js';

const router = express.Router();
router.get('/:userId', controller.getAllChats);

export default router;