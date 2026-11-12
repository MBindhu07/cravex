export const ORDER_STATES = {
  PLACED: 'PLACED',
  RESTAURANT_CONFIRMED: 'RESTAURANT_CONFIRMED',
  PREPARING: 'PREPARING',
  FOOD_READY: 'FOOD_READY',
  DELIVERY_ASSIGNED: 'DELIVERY_ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  REFUND_INITIATED: 'REFUND_INITIATED',
  REFUNDED: 'REFUNDED',
};

// Valid transitions mapping
export const ALLOWED_TRANSITIONS = {
  [ORDER_STATES.PLACED]: [
    ORDER_STATES.RESTAURANT_CONFIRMED,
    ORDER_STATES.REJECTED,
    ORDER_STATES.CANCELLED,
    ORDER_STATES.PAYMENT_FAILED,
  ],
  [ORDER_STATES.RESTAURANT_CONFIRMED]: [
    ORDER_STATES.PREPARING,
    ORDER_STATES.CANCELLED,
    ORDER_STATES.REJECTED,
  ],
  [ORDER_STATES.PREPARING]: [
    ORDER_STATES.FOOD_READY,
    ORDER_STATES.DELIVERY_ASSIGNED,
    ORDER_STATES.CANCELLED,
  ],
  [ORDER_STATES.FOOD_READY]: [
    ORDER_STATES.DELIVERY_ASSIGNED,
    ORDER_STATES.PICKED_UP,
  ],
  [ORDER_STATES.DELIVERY_ASSIGNED]: [
    ORDER_STATES.PICKED_UP,
    ORDER_STATES.CANCELLED,
  ],
  [ORDER_STATES.PICKED_UP]: [
    ORDER_STATES.OUT_FOR_DELIVERY,
    ORDER_STATES.DELIVERED,
  ],
  [ORDER_STATES.OUT_FOR_DELIVERY]: [
    ORDER_STATES.DELIVERED,
    ORDER_STATES.REFUND_INITIATED,
  ],
  [ORDER_STATES.DELIVERED]: [],
  [ORDER_STATES.REJECTED]: [ORDER_STATES.REFUND_INITIATED, ORDER_STATES.REFUNDED],
  [ORDER_STATES.CANCELLED]: [ORDER_STATES.REFUND_INITIATED, ORDER_STATES.REFUNDED],
  [ORDER_STATES.REFUND_INITIATED]: [ORDER_STATES.REFUNDED],
  [ORDER_STATES.REFUNDED]: [],
  [ORDER_STATES.PAYMENT_FAILED]: [],
};

export const canTransition = (currentStatus, newStatus) => {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  return Array.isArray(allowed) && allowed.includes(newStatus);
};

export const getStatusDescription = (status) => {
  switch (status) {
    case ORDER_STATES.PLACED:
      return 'Order placed successfully. Waiting for restaurant confirmation.';
    case ORDER_STATES.RESTAURANT_CONFIRMED:
      return 'Restaurant has confirmed your order. Kitchen is gearing up!';
    case ORDER_STATES.PREPARING:
      return 'Chefs are currently preparing your fresh delicacies.';
    case ORDER_STATES.FOOD_READY:
      return 'Your meal is freshly packed and waiting for delivery partner pickup.';
    case ORDER_STATES.DELIVERY_ASSIGNED:
      return 'Delivery partner has been assigned and is heading to the restaurant.';
    case ORDER_STATES.PICKED_UP:
      return 'Order has been picked up from the restaurant.';
    case ORDER_STATES.OUT_FOR_DELIVERY:
      return 'Delivery partner is on the way to your location!';
    case ORDER_STATES.DELIVERED:
      return 'Delivered! Bon Appétit! Enjoy your delicious meal.';
    case ORDER_STATES.CANCELLED:
      return 'This order was cancelled.';
    case ORDER_STATES.REJECTED:
      return 'Order could not be accepted by the restaurant.';
    case ORDER_STATES.REFUND_INITIATED:
      return 'Refund has been initiated to your original payment method.';
    case ORDER_STATES.REFUNDED:
      return 'Amount has been successfully refunded.';
    default:
      return 'Status update processed.';
  }
};
