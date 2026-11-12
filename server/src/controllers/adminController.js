import { User, Restaurant, Order, Category, Coupon, SupportTicket } from '../models/index.js';

export const getAdminOverview = async (req, res) => {
  try {
    const allUsers = User.find({});
    const allRestaurants = Restaurant.find({});
    const allOrders = Order.find({});

    const totalCustomers = allUsers.filter((u) => u.role === 'customer').length;
    const totalOwners = allUsers.filter((u) => u.role === 'restaurant').length;
    const totalDeliveryPartners = allUsers.filter((u) => u.role === 'delivery').length;

    const approvedRestaurants = allRestaurants.filter((r) => r.status === 'approved').length;
    const pendingRestaurants = allRestaurants.filter((r) => r.status === 'pending').length;

    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter((o) => o.status === 'DELIVERED').length;
    const cancelledOrders = allOrders.filter((o) => ['CANCELLED', 'REJECTED'].includes(o.status)).length;

    // Platform revenue calculation: 15% platform commission on completed orders
    const totalGrossGMV = allOrders
      .filter((o) => o.status === 'DELIVERED')
      .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const platformCommission = Math.round(totalGrossGMV * 0.15);

    // Revenue chart (monthly)
    const monthlyAnalytics = [
      { month: 'Jun', gmv: Math.round(totalGrossGMV * 0.45), revenue: Math.round(platformCommission * 0.45), orders: 120 },
      { month: 'Jul', gmv: Math.round(totalGrossGMV * 0.58), revenue: Math.round(platformCommission * 0.58), orders: 185 },
      { month: 'Aug', gmv: Math.round(totalGrossGMV * 0.72), revenue: Math.round(platformCommission * 0.72), orders: 240 },
      { month: 'Sep', gmv: Math.round(totalGrossGMV * 0.85), revenue: Math.round(platformCommission * 0.85), orders: 295 },
      { month: 'Oct', gmv: Math.round(totalGrossGMV * 0.94), revenue: Math.round(platformCommission * 0.94), orders: 360 },
      { month: 'Nov', gmv: totalGrossGMV, revenue: platformCommission, orders: totalOrders },
    ];

    // Popular cuisines distribution
    const cuisineStats = [
      { name: 'Biryani & Indian', value: 38 },
      { name: 'Gourmet Pizzas', value: 24 },
      { name: 'Burgers & Shakes', value: 18 },
      { name: 'Pan-Asian & Dimsums', value: 12 },
      { name: 'Desserts & Healthy', value: 8 },
    ];

    res.json({
      success: true,
      stats: {
        totalUsers: allUsers.length,
        totalCustomers,
        totalOwners,
        totalDeliveryPartners,
        totalRestaurants: allRestaurants.length,
        approvedRestaurants,
        pendingRestaurants,
        totalOrders,
        completedOrders,
        cancelledOrders,
        totalGrossGMV,
        platformCommission,
        commissionRate: '15%',
      },
      monthlyAnalytics,
      cuisineStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = User.find(query).map((u) => {
      const { password, ...safe } = u;
      return safe;
    });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = User.findByIdAndUpdate(id, {
      isActive: user.isActive === false ? true : false,
    });

    res.json({
      success: true,
      user: updated,
      message: `User ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

export const getAllRestaurantsAdmin = async (req, res) => {
  try {
    const restaurants = Restaurant.find({});
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurants' });
  }
};

export const updateRestaurantApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected' | 'suspended'

    const updated = Restaurant.findByIdAndUpdate(id, { status });
    res.json({
      success: true,
      restaurant: updated,
      message: `Restaurant status updated to ${status}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update approval status' });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    let orders = Order.find({}, { sort: { createdAt: -1 } });

    if (status && status !== 'ALL') {
      orders = orders.filter((o) => o.status === status);
    }

    if (search) {
      const term = search.toLowerCase();
      orders = orders.filter((o) =>
        o._id.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.restaurantName.toLowerCase().includes(term)
      );
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

export const getCouponsAdmin = async (req, res) => {
  try {
    const coupons = Coupon.find({});
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

export const createCouponAdmin = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrder, maxDiscount } = req.body;
    const newCoupon = Coupon.create({
      code: code.toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrder: Number(minOrder || 0),
      maxDiscount: Number(maxDiscount || 500),
      validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      active: true,
      usageCount: 0,
    });

    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};
