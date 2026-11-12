import { Order, FoodItem, Restaurant, User, Coupon, Notification, FoodPassport } from '../models/index.js';
import { ORDER_STATES, canTransition, getStatusDescription } from '../utils/orderStateMachine.js';
import { emitToOrder, emitToRestaurant, emitToDelivery, emitToUser } from '../socket/index.js';

export const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      items = [],
      deliveryAddress,
      deliveryInstructions = '',
      paymentMethod = 'COD',
      couponCode,
      tip = 0,
      isScheduled = false,
      scheduledTime = null,
    } = req.body;

    const customerId = req.user._id;
    const customer = User.findById(customerId);

    if (!restaurantId || !items.length || !deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Please provide restaurant, items, and delivery address' });
    }

    const restaurant = Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Backend validation of items & price recalculation
    let subtotal = 0;
    const verifiedItems = [];

    for (const cartItem of items) {
      const food = FoodItem.findById(cartItem.foodItemId);
      if (!food) {
        return res.status(400).json({ success: false, message: `Item ${cartItem.name || 'unknown'} not found` });
      }

      let unitPrice = food.price;
      // Add customizations pricing
      if (cartItem.selectedSize && cartItem.selectedSize.price) {
        unitPrice += Number(cartItem.selectedSize.price);
      }
      if (cartItem.selectedAddOns && Array.isArray(cartItem.selectedAddOns)) {
        for (const addOn of cartItem.selectedAddOns) {
          unitPrice += Number(addOn.price || 0);
        }
      }

      const qty = Math.max(1, parseInt(cartItem.quantity || 1));
      const itemTotal = unitPrice * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        foodItemId: food._id,
        name: food.name,
        price: unitPrice,
        basePrice: food.price,
        quantity: qty,
        image: food.image,
        isVeg: food.isVeg,
        customizations: {
          size: cartItem.selectedSize?.name || 'Regular',
          spiceLevel: cartItem.selectedSpiceLevel || 'Medium',
          addOns: cartItem.selectedAddOns?.map((a) => a.name) || [],
          specialInstructions: cartItem.specialInstructions || '',
        },
        itemTotal,
      });
    }

    // Free delivery threshold: ₹500
    const deliveryFee = subtotal >= 500 ? 0 : (restaurant.deliveryFee || 40);
    const taxes = Math.round(subtotal * 0.05); // 5% GST

    let discount = 0;
    if (couponCode) {
      const coupon = Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon && subtotal >= (coupon.minOrder || 0)) {
        if (coupon.discountType === 'percentage') {
          discount = Math.min(Math.round((subtotal * coupon.discountValue) / 100), coupon.maxDiscount || 500);
        } else {
          discount = Math.min(coupon.discountValue, subtotal);
        }
        Coupon.findByIdAndUpdate(coupon._id, { usageCount: (coupon.usageCount || 0) + 1 });
      }
    }

    const total = Math.max(0, subtotal + taxes + deliveryFee + Number(tip) - discount);

    // 4-digit OTP for delivery partner hand-off verification
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder = Order.create({
      customerId,
      customerName: customer?.name || req.user.name,
      customerPhone: customer?.phone || '9876543210',
      restaurantId: restaurant._id,
      restaurantName: restaurant.name,
      restaurantLogo: restaurant.logo,
      restaurantAddress: restaurant.address,
      items: verifiedItems,
      deliveryAddress,
      deliveryInstructions,
      pricing: {
        subtotal,
        taxes,
        deliveryFee,
        discount,
        tip: Number(tip) || 0,
        total,
      },
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      },
      status: ORDER_STATES.PLACED,
      statusHistory: [
        {
          status: ORDER_STATES.PLACED,
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer',
        },
      ],
      deliveryPartnerId: null,
      deliveryPartnerName: null,
      deliveryPartnerPhone: null,
      deliveryOtp,
      estimatedDeliveryTime: new Date(Date.now() + (restaurant.deliveryEstimate || 35) * 60000).toISOString(),
      isScheduled,
      scheduledTime,
    });

    // Notify restaurant in real-time
    emitToRestaurant(restaurant._id, 'new_order_incoming', {
      order: newOrder,
      message: `New Order #${newOrder._id.slice(-6)} received!`,
    });

    // Create In-App Notification for customer
    Notification.create({
      userId: customerId,
      role: 'customer',
      title: 'Order Confirmed! 🍕',
      message: `Your order from ${restaurant.name} for ₹${total} has been placed.`,
      link: `/order-tracking/${newOrder._id}`,
      type: 'order',
      read: false,
    });

    res.status(201).json({
      success: true,
      order: newOrder,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = Order.find({ customerId: req.user._id }, { sort: { createdAt: -1 } });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer orders' });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const orders = Order.find({ restaurantId }, { sort: { createdAt: -1 } });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch restaurant orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, cancellationReason, deliveryOtpEntered, deliveryPartnerId } = req.body;

    const order = Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // State machine transition validation
    if (!canTransition(order.status, status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid state transition from '${order.status}' to '${status}'`,
      });
    }

    // If marking as DELIVERED by delivery partner, verify OTP
    if (status === ORDER_STATES.DELIVERED && req.user.role === 'delivery') {
      if (deliveryOtpEntered !== order.deliveryOtp) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect Delivery OTP provided. Ask the customer for the 4-digit OTP.',
        });
      }
    }

    const updateFields = {
      status,
      statusHistory: [
        ...order.statusHistory,
        {
          status,
          timestamp: new Date().toISOString(),
          note: note || getStatusDescription(status),
        },
      ],
    };

    if (cancellationReason) {
      updateFields.cancellationReason = cancellationReason;
    }

    // Auto-assign delivery partner or update delivery partner info
    if (deliveryPartnerId || status === ORDER_STATES.DELIVERY_ASSIGNED) {
      const partner = deliveryPartnerId
        ? User.findById(deliveryPartnerId)
        : User.findOne({ role: 'delivery' });
      if (partner) {
        updateFields.deliveryPartnerId = partner._id;
        updateFields.deliveryPartnerName = partner.name;
        updateFields.deliveryPartnerPhone = partner.phone || '9876543211';
        updateFields.deliveryPartnerLocation = {
          lat: 12.9716 + (Math.random() - 0.5) * 0.02,
          lng: 77.5946 + (Math.random() - 0.5) * 0.02,
        };
      }
    }

    // If delivered, mark payment completed if COD, and award loyalty points
    if (status === ORDER_STATES.DELIVERED) {
      updateFields['payment.status'] = 'PAID';

      const pointsEarned = Math.floor((order.pricing?.total || 100) / 10);
      User.findByIdAndUpdate(order.customerId, {
        $inc: { loyaltyPoints: pointsEarned },
      });

      // Update Food Passport
      const passport = FoodPassport.findOne({ userId: order.customerId });
      if (passport) {
        FoodPassport.findByIdAndUpdate(passport._id, {
          $inc: { points: pointsEarned },
        });
      }

      // Customer notification
      Notification.create({
        userId: order.customerId,
        role: 'customer',
        title: 'Order Delivered! 🎉',
        message: `Enjoy your food! You earned +${pointsEarned} CravePoints.`,
        type: 'order',
        link: `/order-tracking/${order._id}`,
        read: false,
      });
    }

    const updatedOrder = Order.findByIdAndUpdate(id, updateFields);

    // Real-time broadcasts
    emitToOrder(id, 'order_status_updated', {
      order: updatedOrder,
      status,
      description: getStatusDescription(status),
    });

    emitToUser(order.customerId, 'order_status_updated', {
      orderId: id,
      status,
      description: getStatusDescription(status),
    });

    emitToRestaurant(order.restaurantId, 'order_status_updated', {
      orderId: id,
      status,
    });

    res.json({
      success: true,
      order: updatedOrder,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by customer' } = req.body;

    const order = Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== ORDER_STATES.PLACED && order.status !== ORDER_STATES.RESTAURANT_CONFIRMED) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled after kitchen preparation has started',
      });
    }

    const updated = Order.findByIdAndUpdate(id, {
      status: ORDER_STATES.CANCELLED,
      cancellationReason: reason,
      statusHistory: [
        ...order.statusHistory,
        {
          status: ORDER_STATES.CANCELLED,
          timestamp: new Date().toISOString(),
          note: reason,
        },
      ],
    });

    emitToOrder(id, 'order_status_updated', {
      order: updated,
      status: ORDER_STATES.CANCELLED,
      description: 'Order was cancelled.',
    });

    emitToRestaurant(order.restaurantId, 'order_cancelled', { orderId: id });

    res.json({
      success: true,
      order: updated,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
};
