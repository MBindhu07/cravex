import express from 'express';
import {
  getFoodByMood,
  spinTheWheel,
  getFoodPassport,
  getActivePolls,
  createFoodPoll,
  voteOnPoll,
  getBudgetMeals,
  redeemReward,
} from '../controllers/gamificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/mood', getFoodByMood);
router.get('/spin-wheel', spinTheWheel);
router.get('/budget-combos', getBudgetMeals);
router.get('/polls', getActivePolls);

// Protected routes
router.use(protect);
router.get('/food-passport', getFoodPassport);
router.post('/polls', createFoodPoll);
router.post('/polls/vote', voteOnPoll);
router.post('/redeem-reward', redeemReward);

export default router;
