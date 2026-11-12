import express from 'express';
import {
  createGroupOrder,
  getGroupByCode,
  addItemToGroup,
  toggleLockGroup,
} from '../controllers/groupOrderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/create', createGroupOrder);
router.get('/:code', getGroupByCode);
router.post('/:code/add-item', addItemToGroup);
router.put('/:code/toggle-lock', toggleLockGroup);

export default router;
