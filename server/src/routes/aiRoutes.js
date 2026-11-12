import express from 'express';
import { chatWithCraveBot } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', chatWithCraveBot);

export default router;
