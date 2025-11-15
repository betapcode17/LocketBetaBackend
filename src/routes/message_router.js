import express from 'express';
import * as controller from '../controller/message_controller.js';

const router = express.Router();
router.get('/:chatId', controller.getAllMessages);
router.patch('/:messageId', controller.updatedMessage);
router.delete('/:messageId', controller.deleteMessage)

export default router;