import { Order, User, Notification } from '../models/index.js';
import { ORDER_STATES, canTransition } from '../utils/orderStateMachine.js';
import { emitToOrder, emitToUser } from '../socket/index.js';

export const getAvailableDeliveries = async (req, res) => {
  try {
    const orders = Order.find({
      status: { $in: [ORDER_STATES.FOOD_READY, ORDER_STATES.PREPARING] },
      deliveryPartnerId: null,
    });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch available deliveries' });
  }
};

export const getMyDeliveries = async (req, res) => {
  try {
    const partnerId = req.user._id;
    const active = Order.find({
      deliveryPartnerId: partnerId,
      status: { $in: [ORDER_STATES.DELIVERY_ASSIGNED, ORDER_STATES.PICKED_UP, ORDER_STATES.OUT_FOR_DELIVERY] },
    });

    const past = Order.find({
      deliveryPartnerId: partnerId,
      status: ORDER_STATES.DELIVERED,
    }, { sort: { updatedAt: -1 }, limit: 20 });

    res.json({
      success: true,
      activeDeliveries: active,
      completedDeliveries: past,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch delivery assignments' });
  }
};

export const acceptDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const partner = req.user;

    const order = Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryPartnerId && order.deliveryPartnerId !== partner._id) {
      return res.status(400).json({ success: false, message: 'Order already assigned to another partner' });
    }

    const updated = Order.findByIdAndUpdate(orderId, {
      status: ORDER_STATES.DELIVERY_ASSIGNED,
      deliveryPartnerId: partner._id,
      deliveryPartnerName: partner.name,
      deliveryPartnerPhone: partner.phone || '9876543211',
      deliveryPartnerLocation: { lat: 12.9716, lng: 77.5946 },
      statusHistory: [
        ...order.statusHistory,
        {
          status: ORDER_STATES.DELIVERY_ASSIGNED,
          timestamp: new Date().toISOString(),
          note: `Assigned to delivery partner ${partner.name}`,
        },
      ],
    });

    emitToOrder(orderId, 'order_status_updated', {
      order: updated,
      status: ORDER_STATES.DELIVERY_ASSIGNED,
      description: `Delivery partner ${partner.name} is on the way to restaurant.`,
    });

    res.json({ success: true, order: updated, message: 'Delivery assigned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to accept delivery' });
  }
};

export const updateDeliveryStep = async (req, res) => {
  try {
    const { orderId, nextStatus, otp } = req.body;
    const order = Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!canTransition(order.status, nextStatus)) {
      return res.status(400).json({ success: false, message: `Cannot transition from ${order.status} to ${nextStatus}` });
    }

    if (nextStatus === ORDER_STATES.DELIVERED) {
      if (otp !== order.deliveryOtp) {
        return res.status(400).json({ success: false, message: 'Incorrect Delivery OTP provided. Please ask customer.' });
      }
    }

    const updated = Order.findByIdAndUpdate(orderId, {
      status: nextStatus,
      statusHistory: [
        ...order.statusHistory,
        {
          status: nextStatus,
          timestamp: new Date().toISOString(),
          note: `Delivery partner updated status to ${nextStatus}`,
        },
      ],
      ...(nextStatus === ORDER_STATES.DELIVERED ? { 'payment.status': 'PAID' } : {}),
    });

    emitToOrder(orderId, 'order_status_updated', {
      order: updated,
      status: nextStatus,
      description: `Order status is now ${nextStatus}`,
    });

    emitToUser(order.customerId, 'order_status_updated', {
      orderId,
      status: nextStatus,
    });

    res.json({ success: true, order: updated, message: `Status updated to ${nextStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update delivery step' });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;
    const order = Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updated = Order.findByIdAndUpdate(orderId, {
      deliveryPartnerLocation: { lat, lng },
    });

    emitToOrder(orderId, 'delivery_location_updated', {
      orderId,
      lat,
      lng,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, location: { lat, lng } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
};

export const getDeliveryStats = async (req, res) => {
  try {
    const partnerId = req.user._id;
    const completedOrders = Order.find({
      deliveryPartnerId: partnerId,
      status: ORDER_STATES.DELIVERED,
    });

    const earningsPerDelivery = 65; // Base payout ₹65 per delivery
    const totalEarnings = completedOrders.length * earningsPerDelivery;
    const todayEarnings = Math.min(totalEarnings, 650);

    res.json({
      success: true,
      stats: {
        totalDeliveries: completedOrders.length,
        totalEarnings,
        todayEarnings,
        weeklyEarnings: Math.min(totalEarnings, 3200),
        rating: 4.9,
        acceptanceRate: '98%',
        onlineHoursToday: 6.5,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
