import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  updateRestaurant,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getInventory,
  updateInventoryItem,
  getRestaurantAnalytics,
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/my/restaurant', protect, authorize('restaurant'), getMyRestaurant);
router.get('/:id', getRestaurantById);

// Owner routes
router.put('/:id', protect, authorize('restaurant', 'admin'), updateRestaurant);
router.post('/food-items', protect, authorize('restaurant', 'admin'), addFoodItem);
router.put('/food-items/:id', protect, authorize('restaurant', 'admin'), updateFoodItem);
router.delete('/food-items/:id', protect, authorize('restaurant', 'admin'), deleteFoodItem);

// Inventory
router.get('/:restaurantId/inventory', protect, authorize('restaurant', 'admin'), getInventory);
router.put('/inventory/:id', protect, authorize('restaurant', 'admin'), updateInventoryItem);

// Analytics
router.get('/:restaurantId/analytics', protect, authorize('restaurant', 'admin'), getRestaurantAnalytics);

export default router;
