export type UserRole = 'customer' | 'restaurant' | 'delivery' | 'admin';

export interface Address {
  id?: string;
  title: string;
  addressLine: string;
  landmark?: string;
  city: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  loyaltyPoints?: number;
  restaurantId?: string;
  isOnline?: boolean;
  vehicleType?: string;
  isActive?: boolean;
  dietaryPreferences?: {
    isVegOnly?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isJain?: boolean;
    spicePreference?: string;
  };
}

export interface Restaurant {
  _id: string;
  name: string;
  tagline?: string;
  description: string;
  logo: string;
  coverImage: string;
  cuisineTypes: string[];
  rating: number;
  reviewsCount: number;
  deliveryEstimate: number;
  deliveryFee: number;
  minOrder: number;
  specialOffers?: string;
  openingHours: string;
  contactPhone?: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'approved' | 'pending' | 'suspended';
  ownerId?: string;
  isVegOnly?: boolean;
  popularBadge?: boolean;
  bestsellerBadge?: boolean;
  totalOrders?: number;
  totalRevenue?: number;
}

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface FoodCustomizations {
  sizes?: CustomizationOption[];
  spiceLevels?: string[];
  addOns?: CustomizationOption[];
  toppings?: CustomizationOption[];
}

export interface FoodItem {
  _id: string;
  restaurantId: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  isVeg: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isJain?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot' | string;
  preparationTime?: number;
  isBestseller?: boolean;
  isPopular?: boolean;
  available: boolean;
  customizations?: FoodCustomizations;
  calories?: number;
  ingredients?: string[];
  restaurantName?: string;
}

export interface CartItem {
  id: string; // Unique cart item ID (foodItemId + selected variations)
  foodItemId: string;
  name: string;
  basePrice: number;
  price: number; // unit price with customizations
  quantity: number;
  image: string;
  isVeg: boolean;
  restaurantId: string;
  restaurantName: string;
  selectedSize?: CustomizationOption;
  selectedSpiceLevel?: string;
  selectedAddOns?: CustomizationOption[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderState =
  | 'PLACED'
  | 'RESTAURANT_CONFIRMED'
  | 'PREPARING'
  | 'FOOD_READY'
  | 'DELIVERY_ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'PAYMENT_FAILED'
  | 'REFUND_INITIATED'
  | 'REFUNDED';

export interface StatusHistoryItem {
  status: OrderState;
  timestamp: string;
  note?: string;
}

export interface Order {
  _id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string;
  restaurantAddress?: string;
  items: Array<{
    foodItemId: string;
    name: string;
    price: number;
    basePrice?: number;
    quantity: number;
    image: string;
    isVeg: boolean;
    customizations?: {
      size?: string;
      spiceLevel?: string;
      addOns?: string[];
      specialInstructions?: string;
    };
    itemTotal: number;
  }>;
  deliveryAddress: Address;
  deliveryInstructions?: string;
  pricing: {
    subtotal: number;
    taxes: number;
    deliveryFee: number;
    discount: number;
    tip: number;
    total: number;
  };
  payment: {
    method: 'COD' | 'UPI' | 'CARD' | 'WALLET' | 'RAZORPAY';
    status: 'PAID' | 'PENDING' | 'REFUNDED';
    transactionId?: string;
  };
  status: OrderState;
  statusHistory: StatusHistoryItem[];
  deliveryPartnerId?: string | null;
  deliveryPartnerName?: string | null;
  deliveryPartnerPhone?: string | null;
  deliveryPartnerLocation?: { lat: number; lng: number };
  deliveryOtp?: string;
  estimatedDeliveryTime?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupOrderParticipant {
  userId: string;
  name: string;
  items: Array<{
    foodItemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    itemTotal: number;
  }>;
}

export interface GroupOrder {
  _id: string;
  code: string;
  hostId: string;
  hostName: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string;
  deadline: string;
  locked: boolean;
  status: 'OPEN' | 'LOCKED' | 'PLACED';
  participants: GroupOrderParticipant[];
  orderId?: string | null;
}

export interface Review {
  _id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  photos?: string[];
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  validUntil: string;
  usageCount: number;
  active: boolean;
}

export interface InventoryItem {
  _id: string;
  restaurantId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  autoDisableDishIds?: string[];
  lastUpdated: string;
}

export interface SupportTicket {
  _id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  messages: Array<{
    id: string;
    sender: 'customer' | 'support';
    senderName: string;
    text: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface FoodPollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface FoodPoll {
  _id: string;
  title: string;
  description?: string;
  createdBy: string;
  createdByName: string;
  options: FoodPollOption[];
  expiresAt: string;
  active: boolean;
  createdAt: string;
}

export interface FoodPassportBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
}

export interface FoodPassportChallenge {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  rewardPoints: number;
}

export interface FoodPassport {
  _id: string;
  userId: string;
  points: number;
  badges: FoodPassportBadge[];
  cuisinesExplored: string[];
  challenges: FoodPassportChallenge[];
}

export interface InAppNotification {
  _id: string;
  userId?: string;
  role?: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system' | 'delivery' | 'inventory';
  link?: string;
  read: boolean;
  createdAt: string;
}
