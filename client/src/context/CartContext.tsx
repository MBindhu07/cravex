import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, FoodItem, CustomizationOption } from '../types/index.ts';

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (
    food: FoodItem,
    customizations?: {
      size?: CustomizationOption;
      spiceLevel?: string;
      addOns?: CustomizationOption[];
      specialInstructions?: string;
    },
    quantity?: number
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  tip: number;
  setTip: (tip: number) => void;
  total: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  totalItemCount: number;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cravex_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [restaurantId, setRestaurantId] = useState<string | null>(() => {
    return localStorage.getItem('cravex_cart_rest_id');
  });

  const [restaurantName, setRestaurantName] = useState<string | null>(() => {
    return localStorage.getItem('cravex_cart_rest_name');
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return localStorage.getItem('cravex_cart_coupon');
  });

  const [tip, setTip] = useState<number>(20);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cravex_cart', JSON.stringify(items));
    if (restaurantId) localStorage.setItem('cravex_cart_rest_id', restaurantId);
    else localStorage.removeItem('cravex_cart_rest_id');

    if (restaurantName) localStorage.setItem('cravex_cart_rest_name', restaurantName);
    else localStorage.removeItem('cravex_cart_rest_name');

    if (appliedCoupon) localStorage.setItem('cravex_cart_coupon', appliedCoupon);
    else localStorage.removeItem('cravex_cart_coupon');
  }, [items, restaurantId, restaurantName, appliedCoupon]);

  const addItem = (
    food: FoodItem,
    customizations: {
      size?: CustomizationOption;
      spiceLevel?: string;
      addOns?: CustomizationOption[];
      specialInstructions?: string;
    } = {},
    quantity = 1
  ) => {
    // If cart has items from another restaurant, confirm reset
    if (restaurantId && restaurantId !== food.restaurantId && items.length > 0) {
      const confirmReset = window.confirm(
        `Your cart contains items from "${restaurantName}". Do you want to clear your cart and start a new order from this restaurant?`
      );
      if (!confirmReset) return;
      setItems([]);
    }

    setRestaurantId(food.restaurantId);
    setRestaurantName(food.restaurantName || 'Restaurant');

    let unitPrice = food.price;
    if (customizations.size?.price) unitPrice += customizations.size.price;
    if (customizations.addOns) {
      customizations.addOns.forEach((a) => (unitPrice += a.price || 0));
    }

    // Build unique identifier based on foodId + size + addOns
    const sizeKey = customizations.size?.name || 'def';
    const addOnsKey = (customizations.addOns || []).map((a) => a.name).sort().join('_');
    const spiceKey = customizations.spiceLevel || 'med';
    const cartItemId = `${food._id}_${sizeKey}_${spiceKey}_${addOnsKey}`;

    const existingIndex = items.findIndex((it) => it.id === cartItemId);

    let updatedList: CartItem[];
    let targetItem: CartItem;

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const newQty = existing.quantity + quantity;
      targetItem = {
        ...existing,
        quantity: newQty,
        itemTotal: newQty * existing.price,
      };
      updatedList = [...items];
      updatedList[existingIndex] = targetItem;
    } else {
      targetItem = {
        id: cartItemId,
        foodItemId: food._id,
        name: food.name,
        basePrice: food.price,
        price: unitPrice,
        quantity,
        image: food.image,
        isVeg: food.isVeg,
        restaurantId: food.restaurantId,
        restaurantName: food.restaurantName || 'Restaurant',
        selectedSize: customizations.size,
        selectedSpiceLevel: customizations.spiceLevel,
        selectedAddOns: customizations.addOns,
        specialInstructions: customizations.specialInstructions,
        itemTotal: unitPrice * quantity,
      };
      updatedList = [...items, targetItem];
    }

    setItems(updatedList);
    setLastAddedItem(targetItem);
  };

  const removeItem = (cartItemId: string) => {
    const next = items.filter((it) => it.id !== cartItemId);
    setItems(next);
    if (next.length === 0) {
      setRestaurantId(null);
      setRestaurantName(null);
      setAppliedCoupon(null);
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((it) =>
        it.id === cartItemId
          ? {
              ...it,
              quantity,
              itemTotal: quantity * it.price,
            }
          : it
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): boolean => {
    const validCodes = ['FIRST50', 'CRAVEFEST', 'HUNGRY20', 'FLAT100'];
    if (validCodes.includes(code.toUpperCase())) {
      setAppliedCoupon(code.toUpperCase());
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const freeDeliveryThreshold = 500;
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= freeDeliveryThreshold ? 0 : 35;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const taxes = Math.round(subtotal * 0.05); // 5% GST

  let discount = 0;
  if (appliedCoupon === 'FIRST50') {
    discount = Math.min(Math.round(subtotal * 0.5), 150);
  } else if (appliedCoupon === 'CRAVEFEST' || appliedCoupon === 'HUNGRY20') {
    discount = Math.min(Math.round(subtotal * 0.2), 100);
  } else if (appliedCoupon === 'FLAT100') {
    discount = subtotal >= 499 ? 100 : 0;
  }

  const total = Math.max(0, subtotal + taxes + deliveryFee + tip - discount);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        taxes,
        discount,
        tip,
        setTip,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        totalItemCount,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
