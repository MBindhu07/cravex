import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const CartPage: React.FC = () => {
  const {
    items,
    restaurantName,
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
  } = useCart();

  const { addToast } = useNotifications();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const success = applyCoupon(couponInput.trim());
    if (success) {
      addToast('Coupon Applied! 🎉', `Promo code ${couponInput.toUpperCase()} activated.`, 'success');
      setCouponInput('');
    } else {
      addToast('Invalid Coupon ⚠️', 'Please try codes: FIRST50, CRAVEFEST, or FLAT100', 'warning');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-charcoal-800 flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          🛒
        </div>
        <h2 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
          Your Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
          Looks like you haven't added any delicacies yet. Explore top restaurants and satisfy your cravings!
        </p>
        <Link
          to="/restaurants"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all"
        >
          <span>Explore Restaurants</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Progress percentage for free delivery
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
            Shopping Cart ({totalItemCount})
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-0.5">
            Ordering from <span className="font-bold text-primary">{restaurantName}</span>
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List & Upsell */}
        <div className="lg:col-span-7 space-y-6">
          {/* Free Delivery Threshold Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="flex items-center gap-1.5 text-charcoal-700 dark:text-gray-200">
                <span>🚚</span>
                {amountNeededForFreeDelivery === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Congratulations! You unlocked FREE Delivery!
                  </span>
                ) : (
                  <span>Add ₹{amountNeededForFreeDelivery} more for FREE Delivery</span>
                )}
              </span>
              <span className="text-primary font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-charcoal-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 dark:border-charcoal-700 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 border flex items-center justify-center rounded-xs ${item.isVeg ? 'border-emerald-500' : 'border-red-500'}`}>
                        <span className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-charcoal-800 dark:text-gray-100 truncate">
                        {item.name}
                      </h4>
                    </div>

                    {/* Customizations tags */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.selectedSize && (
                        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-charcoal-700 px-1.5 py-0.5 rounded-md">
                          {item.selectedSize.name}
                        </span>
                      )}
                      {item.selectedSpiceLevel && (
                        <span className="text-[10px] text-orange-500 bg-orange-50 dark:bg-charcoal-700 px-1.5 py-0.5 rounded-md">
                          🌶️ {item.selectedSpiceLevel}
                        </span>
                      )}
                      {item.selectedAddOns?.map((a) => (
                        <span key={a.name} className="text-[10px] text-primary bg-orange-50 dark:bg-charcoal-700 px-1.5 py-0.5 rounded-md">
                          +{a.name}
                        </span>
                      ))}
                    </div>

                    <p className="font-extrabold text-xs text-charcoal-900 dark:text-white mt-1">
                      ₹{item.itemTotal}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center bg-gray-50 dark:bg-charcoal-700 rounded-xl border border-gray-200 dark:border-charcoal-600 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-charcoal-600 text-charcoal-600 dark:text-gray-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-charcoal-600 text-charcoal-600 dark:text-gray-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tip Delivery Partner */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-5 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <p className="font-bold text-xs text-charcoal-800 dark:text-white mb-2">
              Tip your Delivery Hero (100% goes to partner)
            </p>
            <div className="flex items-center gap-2">
              {[0, 10, 20, 30, 50].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTip(amount)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    tip === amount
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-gray-50 dark:bg-charcoal-700 text-charcoal-700 dark:text-gray-300 border-gray-200 dark:border-charcoal-600'
                  }`}
                >
                  {amount === 0 ? 'No tip' : `₹${amount}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bill Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-5 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-800 dark:text-gray-200 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Apply Promo Code</span>
            </h4>

            {appliedCoupon ? (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>
                    Code <strong className="font-mono">{appliedCoupon}</strong> applied (-₹{discount})
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. FIRST50, CRAVEFEST"
                  className="flex-grow px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 font-mono focus:outline-none focus:border-primary uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Quick coupon tags */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-charcoal-700 text-[11px]">
              <span className="text-gray-400">Available:</span>
              <button
                onClick={() => applyCoupon('FIRST50')}
                className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-charcoal-700 text-primary font-mono font-bold hover:underline"
              >
                FIRST50 (50% off)
              </button>
              <button
                onClick={() => applyCoupon('CRAVEFEST')}
                className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-charcoal-700 text-primary font-mono font-bold hover:underline"
              >
                CRAVEFEST (20% off)
              </button>
            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft space-y-3">
            <h4 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white pb-2 border-b border-gray-100 dark:border-charcoal-700">
              Bill Summary
            </h4>

            <div className="flex items-center justify-between text-xs text-charcoal-600 dark:text-gray-300">
              <span>Item Subtotal</span>
              <span className="font-semibold text-charcoal-800 dark:text-white">₹{subtotal}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-600 dark:text-gray-300">
              <span>Delivery Fee</span>
              <span className="font-semibold">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-500 font-bold">FREE</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-600 dark:text-gray-300">
              <span>Taxes & Restaurant Charges (5% GST)</span>
              <span className="font-semibold text-charcoal-800 dark:text-white">₹{taxes}</span>
            </div>

            {tip > 0 && (
              <div className="flex items-center justify-between text-xs text-charcoal-600 dark:text-gray-300">
                <span>Rider Tip</span>
                <span className="font-semibold text-charcoal-800 dark:text-white">₹{tip}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                <span>Coupon Savings</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center justify-between font-display font-extrabold text-base text-charcoal-900 dark:text-white">
              <span>To Pay</span>
              <span className="text-xl text-primary">₹{total}</span>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 py-4 px-6 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-sm shadow-premium flex items-center justify-between transition-all transform active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1 font-extrabold">
                <span>₹{total}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
