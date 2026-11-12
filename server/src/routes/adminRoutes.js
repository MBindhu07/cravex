import express from 'express';
import {
  getAdminOverview,
  getAllUsers,
  toggleUserStatus,
  getAllRestaurantsAdmin,
  updateRestaurantApproval,
  getAllOrdersAdmin,
  getCouponsAdmin,
  createCouponAdmin,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/restaurants', getAllRestaurantsAdmin);
router.put('/restaurants/:id/approval', updateRestaurantApproval);
router.get('/orders', getAllOrdersAdmin);
router.get('/coupons', getCouponsAdmin);
router.post('/coupons', createCouponAdmin);

export default router;
