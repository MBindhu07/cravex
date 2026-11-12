import { FoodItem, Restaurant, FoodPassport, FoodPoll, Coupon, User } from '../models/index.js';

export const getFoodByMood = async (req, res) => {
  try {
    const { mood = 'Happy' } = req.query;
    const allDishes = FoodItem.find({ available: true });

    let filtered = [];
    let tagline = '';

    switch (mood.toLowerCase()) {
      case 'happy':
        filtered = allDishes.filter((d) => d.category.includes('Pizza') || d.category.includes('Burger') || d.isBestseller);
        tagline = 'Double your joy with our cheerful comfort foods!';
        break;
      case 'sad':
        filtered = allDishes.filter((d) => d.category.includes('Dessert') || d.description.toLowerCase().includes('chocolate') || d.category.includes('Pasta'));
        tagline = 'Warm comforting bites that give your soul a hearty hug.';
        break;
      case 'stressed':
        filtered = allDishes.filter((d) => d.category.includes('Biryani') || d.spiceLevel === 'Hot' || d.category.includes('Noodles'));
        tagline = 'Destress with punchy, bold flavors that awaken your senses.';
        break;
      case 'tired':
        filtered = allDishes.filter((d) => d.category.includes('Bowl') || d.category.includes('Healthy') || d.preparationTime <= 20);
        tagline = 'Effortless, revitalizing meals to refuel your energy quickly.';
        break;
      case 'celebrating':
        filtered = allDishes.filter((d) => d.price > 350 || d.isBestseller);
        tagline = 'Grand feasts and artisanal platters made for champions!';
        break;
      case 'romantic':
        filtered = allDishes.filter((d) => d.category.includes('Italian') || d.category.includes('Dessert') || d.category.includes('Sushi'));
        tagline = 'Candlelight flavors crafted for unforgettable moments together.';
        break;
      case 'hungry':
        filtered = allDishes.filter((d) => d.name.toLowerCase().includes('platter') || d.category.includes('Biryani') || d.category.includes('Burger'));
        tagline = 'Heavyweight portions to conquer the biggest appetite.';
        break;
      case 'adventure':
        filtered = allDishes.filter((d) => d.spiceLevel === 'Extra Hot' || d.category.includes('Asian') || d.category.includes('Mexican'));
        tagline = 'Bold, exotic ingredients for daring food adventurers.';
        break;
      default:
        filtered = allDishes.slice(0, 6);
        tagline = 'Delicious meals ready to be savored.';
    }

    const restaurants = Restaurant.find({});
    const enriched = (filtered.length ? filtered : allDishes).slice(0, 6).map((dish) => {
      const rest = restaurants.find((r) => r._id === dish.restaurantId);
      return {
        ...dish,
        restaurantName: rest?.name || 'CraveX Gourmet',
      };
    });

    res.json({
      success: true,
      mood,
      tagline,
      dishes: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch mood food' });
  }
};

export const spinTheWheel = async (req, res) => {
  try {
    const { vegOnly, maxBudget } = req.query;
    let dishes = FoodItem.find({ available: true });

    if (vegOnly === 'true') {
      dishes = dishes.filter((d) => d.isVeg);
    }

    if (maxBudget) {
      const budget = Number(maxBudget);
      dishes = dishes.filter((d) => d.price <= budget);
    }

    if (!dishes.length) {
      dishes = FoodItem.find({ available: true });
    }

    // Pick 8 items to populate wheel segments
    const shuffled = [...dishes].sort(() => 0.5 - Math.random());
    const wheelSegments = shuffled.slice(0, 8);

    // Pick winning index
    const winningIndex = Math.floor(Math.random() * wheelSegments.length);
    const winningDish = wheelSegments[winningIndex];

    const restaurant = Restaurant.findById(winningDish.restaurantId);

    res.json({
      success: true,
      wheelSegments: wheelSegments.map((d, index) => ({
        index,
        id: d._id,
        name: d.name,
        price: d.price,
        image: d.image,
      })),
      winningIndex,
      winner: {
        ...winningDish,
        restaurantName: restaurant?.name || 'CraveX Spot',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to spin wheel' });
  }
};

export const getFoodPassport = async (req, res) => {
  try {
    const userId = req.user._id;
    let passport = FoodPassport.findOne({ userId });

    if (!passport) {
      passport = FoodPassport.create({
        userId,
        points: 150,
        badges: [
          { id: 'welcome', name: 'Crave Starter', icon: '🎉', description: 'Joined the CraveX foodie community', unlockedAt: new Date().toISOString() },
          { id: 'biryani', name: 'Biryani Explorer', icon: '🍲', description: 'Ordered traditional fragrant dum biryani', unlockedAt: new Date().toISOString() },
        ],
        cuisinesExplored: ['North Indian', 'Italian', 'Asian'],
        challenges: [
          { id: 'c1', title: 'Try 3 different cuisines', target: 3, current: 2, completed: false, rewardPoints: 200 },
          { id: 'c2', title: 'Order after 10 PM', target: 1, current: 1, completed: true, rewardPoints: 100 },
          { id: 'c3', title: 'Order a green superfood salad', target: 1, current: 0, completed: false, rewardPoints: 150 },
        ],
      });
    }

    const availableBadges = [
      { id: 'pizza', name: 'Pizza Lover', icon: '🍕', description: 'Ordered 3 artisanal pizzas' },
      { id: 'biryani', name: 'Biryani Explorer', icon: '🍲', description: 'Explored fragrant basmati dum biryanis' },
      { id: 'dessert', name: 'Dessert Addict', icon: '🍰', description: 'Indulged in rich decadent sweet treats' },
      { id: 'street', name: 'Street Food Explorer', icon: '🌮', description: 'Tried spicy street delicacies and chaats' },
      { id: 'healthy', name: 'Healthy Eater', icon: '🥗', description: 'Ordered 3 nutritious superfood bowls' },
      { id: 'global', name: 'Global Food Explorer', icon: '🌍', description: 'Sampled 5 international cuisines' },
    ];

    res.json({
      success: true,
      passport,
      availableBadges,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch Food Passport' });
  }
};

// Food Polls
export const getActivePolls = async (req, res) => {
  try {
    const polls = FoodPoll.find({ active: true }, { sort: { createdAt: -1 } });
    res.json({ success: true, polls });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch polls' });
  }
};

export const createFoodPoll = async (req, res) => {
  try {
    const { title, options = [] } = req.body;
    const user = req.user;

    if (!title || options.length < 2) {
      return res.status(400).json({ success: false, message: 'Please provide a question and at least 2 options' });
    }

    const poll = FoodPoll.create({
      title,
      createdBy: user._id,
      createdByName: user.name,
      options: options.map((opt, i) => ({
        id: `opt_${i + 1}`,
        text: typeof opt === 'string' ? opt : opt.text,
        votes: [],
      })),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      active: true,
    });

    res.status(201).json({ success: true, poll });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create poll' });
  }
};

export const voteOnPoll = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = req.user._id;

    const poll = FoodPoll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    // Remove existing vote by user in this poll if any
    poll.options.forEach((opt) => {
      opt.votes = opt.votes.filter((uid) => uid !== userId);
    });

    // Add vote to chosen option
    const targetOpt = poll.options.find((opt) => opt.id === optionId);
    if (targetOpt) {
      targetOpt.votes.push(userId);
    }

    const updated = FoodPoll.findByIdAndUpdate(pollId, { options: poll.options });
    res.json({ success: true, poll: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to record vote' });
  }
};

// Smart Budget Combos
export const getBudgetMeals = async (req, res) => {
  try {
    const maxBudget = Number(req.query.budget) || 300;
    const allDishes = FoodItem.find({ available: true });
    const restaurants = Restaurant.find({});

    // Filter dishes that with 5% tax and ~₹30 delivery fee comfortably fit inside budget
    const targetItemPrice = maxBudget - 35; // buffer for tax + delivery
    const eligibleDishes = allDishes
      .filter((d) => d.price <= targetItemPrice)
      .map((d) => {
        const rest = restaurants.find((r) => r._id === d.restaurantId);
        const taxes = Math.round(d.price * 0.05);
        const deliveryFee = rest?.deliveryFee || 35;
        const total = d.price + taxes + deliveryFee;
        return {
          dish: d,
          restaurant: rest,
          breakdown: {
            itemPrice: d.price,
            taxes,
            deliveryFee,
            total,
            savings: Math.max(0, maxBudget - total),
          },
        };
      })
      .filter((item) => item.breakdown.total <= maxBudget)
      .sort((a, b) => b.dish.price - a.dish.price)
      .slice(0, 10);

    res.json({
      success: true,
      budget: maxBudget,
      matches: eligibleDishes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate budget meals' });
  }
};

// Loyalty Rewards
export const redeemReward = async (req, res) => {
  try {
    const { pointsCost, discountAmount } = req.body;
    const user = User.findById(req.user._id);

    if ((user.loyaltyPoints || 0) < pointsCost) {
      return res.status(400).json({ success: false, message: 'Insufficient CravePoints balance' });
    }

    const promoCode = `CRAVE${discountAmount}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Deduct points
    User.findByIdAndUpdate(user._id, {
      loyaltyPoints: user.loyaltyPoints - pointsCost,
    });

    // Create unique coupon
    Coupon.create({
      code: promoCode,
      discountType: 'fixed',
      discountValue: discountAmount,
      minOrder: discountAmount * 2,
      maxDiscount: discountAmount,
      validUntil: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      active: true,
    });

    res.json({
      success: true,
      code: promoCode,
      discountAmount,
      remainingPoints: user.loyaltyPoints - pointsCost,
      message: `Redeemed ${pointsCost} points for ₹${discountAmount} voucher: ${promoCode}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to redeem reward' });
  }
};
