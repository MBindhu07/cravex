import express from 'express';
import {
  createTicket,
  getMyTickets,
  getAllTicketsAdmin,
  replyToTicket,
} from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createTicket);
router.get('/my-tickets', getMyTickets);
router.get('/all', authorize('admin'), getAllTicketsAdmin);
router.post('/:id/reply', replyToTicket);

export default router;
