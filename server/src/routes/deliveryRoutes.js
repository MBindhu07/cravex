import express from 'express';
import {
  getAvailableDeliveries,
  getMyDeliveries,
  acceptDelivery,
  updateDeliveryStep,
  updateLocation,
  getDeliveryStats,
} from '../controllers/deliveryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('delivery', 'admin'));

router.get('/available', getAvailableDeliveries);
router.get('/my-deliveries', getMyDeliveries);
router.post('/accept', acceptDelivery);
router.post('/step', updateDeliveryStep);
router.post('/location', updateLocation);
router.get('/stats', getDeliveryStats);

export default router;
