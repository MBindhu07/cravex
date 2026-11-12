import { FoodItem, Restaurant, Order } from '../models/index.js';

export const chatWithCraveBot = async (req, res) => {
  try {
    const { message = '', context = {} } = req.body;
    const query = message.toLowerCase().trim();
    const userId = req.user?._id;

    const allDishes = FoodItem.find({ available: true });
    const allRestaurants = Restaurant.find({ status: 'approved' });

    let botResponse = '';
    let recommendedDishes = [];
    let recommendedRestaurants = [];

    // 1. Budget based queries (e.g., "under 200", "under ₹300", "budget")
    const budgetMatch = query.match(/(?:under|below|budget|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) || query.match(/(\d+)\s*(?:rupees|rs|bucks)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

    if (budget) {
      const budgetDishes = allDishes.filter((d) => d.price <= budget);
      recommendedDishes = budgetDishes.slice(0, 4);
      botResponse = `I found ${budgetDishes.length} mouth-watering options under ₹${budget}! Here are my top budget picks packed with great taste:`;
    }
    // 2. Spicy vegetarian food
    else if (query.includes('spicy') && (query.includes('veg') || query.includes('vegetarian'))) {
      recommendedDishes = allDishes
        .filter((d) => d.isVeg && ['Hot', 'Extra Hot', 'Medium'].includes(d.spiceLevel))
        .slice(0, 4);
      botResponse = `Fiery cravings? Here are the most flavorful, spicy vegetarian dishes ready to satisfy your tastebuds!`;
    }
    // 3. Healthy / Salad / Diet / Clean eating
    else if (query.includes('healthy') || query.includes('salad') || query.includes('diet') || query.includes('protein')) {
      recommendedDishes = allDishes
        .filter((d) => d.category.toLowerCase().includes('salad') || d.category.toLowerCase().includes('healthy') || (d.calories && d.calories < 450))
        .slice(0, 4);
      if (!recommendedDishes.length) {
        recommendedDishes = allDishes.filter((d) => d.isVeg).slice(0, 3);
      }
      botResponse = `Awesome choice prioritizing health! Here are fresh, wholesome, nutrient-rich meals that taste delightful without the guilt:`;
    }
    // 4. Quick delivery / fast / in a hurry
    else if (query.includes('quick') || query.includes('fast') || query.includes('hurry') || query.includes('rush')) {
      recommendedRestaurants = allRestaurants
        .filter((r) => r.deliveryEstimate <= 30)
        .sort((a, b) => a.deliveryEstimate - b.deliveryEstimate)
        .slice(0, 3);
      botResponse = `Got hunger pangs right now? These top-rated restaurants deliver under 30 minutes:`;
    }
    // 5. Group of friends / Party / Feast
    else if (query.includes('group') || query.includes('party') || query.includes('friends') || query.includes('family') || query.includes('four') || query.includes('many')) {
      recommendedDishes = allDishes
        .filter((d) => d.category.toLowerCase().includes('pizza') || d.category.toLowerCase().includes('biryani') || d.category.toLowerCase().includes('combo') || d.price > 350)
        .slice(0, 4);
      botResponse = `Ordering for a squad? Nothing beats sharing gourmet pizzas, royal dum biryanis, and feast platters! Check these out:`;
    }
    // 6. Biryani
    else if (query.includes('biryani')) {
      recommendedDishes = allDishes.filter((d) => d.name.toLowerCase().includes('biryani') || d.category.toLowerCase().includes('biryani')).slice(0, 4);
      botResponse = `Ah, the royal crave! Handcrafted dum biryanis cooked with fragrant basmati and aromatic spices:`;
    }
    // 7. Pizza / Italian / Pasta
    else if (query.includes('pizza') || query.includes('pasta') || query.includes('italian')) {
      recommendedDishes = allDishes.filter((d) => d.category.toLowerCase().includes('pizza') || d.name.toLowerCase().includes('pizza')).slice(0, 4);
      botResponse = `Craving cheesy goodness? These stone-baked artisanal pizzas are absolute bestsellers:`;
    }
    // 8. Dessert / Sweet / Cake / Ice Cream
    else if (query.includes('dessert') || query.includes('sweet') || query.includes('cake') || query.includes('chocolate')) {
      recommendedDishes = allDishes.filter((d) => d.category.toLowerCase().includes('dessert') || d.description.toLowerCase().includes('chocolate')).slice(0, 4);
      botResponse = `Sweet tooth alert! Treat yourself to these decadent desserts and waffles:`;
    }
    // 9. General recommendation / "What should I eat today?"
    else {
      // Pick bestsellers & popular
      const bestsellers = allDishes.filter((d) => d.isBestseller || d.isPopular);
      recommendedDishes = (bestsellers.length > 0 ? bestsellers : allDishes).slice(0, 4);
      botResponse = `Hello foodie! Based on what's trending across town today, here are our chefs' most beloved signature dishes:`;
    }

    // Attach restaurant names to recommended dishes
    const enrichedDishes = recommendedDishes.map((dish) => {
      const rest = allRestaurants.find((r) => r._id === dish.restaurantId);
      return {
        ...dish,
        restaurantName: rest?.name || 'CraveX Kitchen',
        deliveryEstimate: rest?.deliveryEstimate || 30,
      };
    });

    res.json({
      success: true,
      botResponse,
      recommendedDishes: enrichedDishes,
      recommendedRestaurants,
      suggestedQuestions: [
        'Suggest something under ₹250',
        'I want spicy vegetarian meals',
        'Recommend healthy salads',
        'Find restaurants with 25-min delivery',
      ],
    });
  } catch (error) {
    console.error('CraveBot error:', error);
    res.status(500).json({ success: false, message: 'CraveBot encountered an issue' });
  }
};
