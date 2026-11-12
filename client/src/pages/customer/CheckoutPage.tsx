import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import api from '../../services/api.ts';
import { Address } from '../../types/index.ts';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    restaurantId,
    restaurantName,
    subtotal,
    deliveryFee,
    taxes,
    discount,
    tip,
    total,
    appliedCoupon,
    clearCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  // Address Selection
  const defaultAddresses: Address[] = user?.addresses?.length
    ? user.addresses
    : [
        {
          id: 'addr-1',
          title: 'Home',
          addressLine: 'Flat 402, Sunshine Heights, 100ft Road, Indiranagar',
          landmark: 'Opposite Metro Pillar 182',
          city: 'Bengaluru',
          postalCode: '560038',
          isDefault: true,
        },
        {
          id: 'addr-2',
          title: 'Office',
          addressLine: 'WeWork Galaxy, 43 Residency Road',
          landmark: 'Near Brigade Road junction',
          city: 'Bengaluru',
          postalCode: '560025',
          isDefault: false,
        },
      ];

  const [selectedAddress, setSelectedAddress] = useState<Address>(defaultAddresses[0]);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('Today, 8:30 PM');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'WALLET' | 'RAZORPAY'>('UPI');
  const [placingOrder, setPlacingOrder] = useState(false);

  // New Address Modal state
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Other');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim()) return;

    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      title: newTitle,
      addressLine: newAddressLine,
      landmark: newLandmark,
      city: 'Bengaluru',
      postalCode: '560038',
    };

    setSelectedAddress(newAddr);
    setShowNewAddressModal(false);
    addToast('Address Added 📍', 'New delivery destination selected.', 'success');
  };

  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) return;
    setPlacingOrder(true);

    try {
      const payload = {
        restaurantId,
        items: items.map((it) => ({
          foodItemId: it.foodItemId,
          name: it.name,
          quantity: it.quantity,
          selectedSize: it.selectedSize,
          selectedSpiceLevel: it.selectedSpiceLevel,
          selectedAddOns: it.selectedAddOns,
          specialInstructions: it.specialInstructions,
        })),
        deliveryAddress: selectedAddress,
        deliveryInstructions,
        paymentMethod,
        couponCode: appliedCoupon || undefined,
        tip,
        isScheduled,
        scheduledTime: isScheduled ? scheduledTime : null,
      };

      const res = await api.createOrder(payload);

      if (res.success && res.order) {
        clearCart();
        addToast('Order Placed Successfully! 🍕', `Order #${res.order._id.slice(-6)} is confirmed.`, 'success');
        navigate(`/order-tracking/${res.order._id}`);
      } else {
        addToast('Order Failed', res.message || 'Could not place order', 'error');
      }
    } catch (err: any) {
      addToast('Order Failed', err.message || 'Network error while placing order', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
          Complete Your Order
        </h1>
        <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
          Review delivery destination, schedule, and preferred payment method
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Address, Timing & Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Delivery Address Selection */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Delivery Address</span>
              </h3>
              <button
                onClick={() => setShowNewAddressModal(true)}
                className="text-xs font-bold text-primary hover:text-primary-600 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {defaultAddresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-primary bg-orange-50/60 dark:bg-charcoal-700 shadow-sm'
                        : 'border-gray-200 dark:border-charcoal-700 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-charcoal-800 dark:text-white flex items-center gap-1.5">
                        <span>{addr.title === 'Home' ? '🏠' : '🏢'}</span>
                        <span>{addr.title}</span>
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-charcoal-600 dark:text-gray-300 line-clamp-2">
                      {addr.addressLine}
                    </p>
                    {addr.landmark && (
                      <p className="text-[10px] text-gray-400 mt-1">Landmark: {addr.landmark}</p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Delivery Instructions */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-charcoal-700">
              <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 mb-1.5">
                Drop-off Instructions (Optional)
              </label>
              <input
                type="text"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Leave with building security, call upon reaching..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* 2. Timing Schedule */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <span>Delivery Timing</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsScheduled(false)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  !isScheduled
                    ? 'border-primary bg-orange-50/70 dark:bg-charcoal-700 shadow-sm'
                    : 'border-gray-200 dark:border-charcoal-700'
                }`}
              >
                <p className="font-bold text-xs text-charcoal-800 dark:text-white">🚀 ASAP Delivery</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Approx. 30-35 mins</p>
              </button>

              <button
                onClick={() => setIsScheduled(true)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isScheduled
                    ? 'border-primary bg-orange-50/70 dark:bg-charcoal-700 shadow-sm'
                    : 'border-gray-200 dark:border-charcoal-700'
                }`}
              >
                <p className="font-bold text-xs text-charcoal-800 dark:text-white">⏰ Schedule for Later</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{scheduledTime}</p>
              </button>
            </div>
          </div>

          {/* 3. Payment Methods */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              {[
                { id: 'UPI', title: 'UPI Instant Pay', subtitle: 'Google Pay, PhonePe, Paytm QR', icon: '📱' },
                { id: 'CARD', title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, RuPay (Test Mode)', icon: '💳' },
                { id: 'RAZORPAY', title: 'Razorpay Payment Gateway', subtitle: 'Netbanking, Cards & UPI Test', icon: '⚡' },
                { id: 'COD', title: 'Cash on Delivery', subtitle: 'Pay cash or UPI upon delivery', icon: '💵' },
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-orange-50/60 dark:bg-charcoal-700 shadow-sm'
                        : 'border-gray-200 dark:border-charcoal-700 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{method.icon}</span>
                      <div>
                        <p className="font-bold text-xs text-charcoal-800 dark:text-white">{method.title}</p>
                        <p className="text-[11px] text-gray-500">{method.subtitle}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                      {isSelected && <span className="text-[9px]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Zero card details are ever stored. 256-bit SSL simulated sandbox checkout.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items Summary & Checkout Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft space-y-4">
            <h4 className="font-display font-extrabold text-sm text-charcoal-900 dark:text-white pb-2 border-b border-gray-100 dark:border-charcoal-700">
              Order from {restaurantName}
            </h4>

            {/* Quick list of items */}
            <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-xs">
                  <div className="truncate max-w-[200px]">
                    <span className="font-bold text-charcoal-800 dark:text-white mr-1.5">{it.quantity}x</span>
                    <span className="text-charcoal-700 dark:text-gray-300">{it.name}</span>
                  </div>
                  <span className="font-bold text-charcoal-900 dark:text-white">₹{it.itemTotal}</span>
                </div>
              ))}
            </div>

            {/* Pricing details */}
            <div className="pt-3 border-t border-gray-100 dark:border-charcoal-700 space-y-2 text-xs text-charcoal-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Taxes (5%)</span>
                <span>₹{taxes}</span>
              </div>
              {tip > 0 && (
                <div className="flex justify-between">
                  <span>Rider Tip</span>
                  <span>₹{tip}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-100 dark:border-charcoal-700 flex justify-between font-display font-extrabold text-base text-charcoal-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-xl text-primary">₹{total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-primary-600 disabled:opacity-50 text-white font-bold text-sm shadow-premium flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {placingOrder ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transacting Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order • ₹{total}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {showNewAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 dark:border-charcoal-700">
            <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-4">
              Add Delivery Destination
            </h3>
            <form onSubmit={handleAddNewAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Tag</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Friends', 'Other'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewTitle(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        newTitle === t
                          ? 'bg-primary text-white border-primary'
                          : 'bg-gray-50 dark:bg-charcoal-700 text-charcoal-700 dark:text-gray-200 border-gray-200 dark:border-charcoal-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Address</label>
                <textarea
                  required
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  placeholder="Flat/House No, Building, Street, Area"
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-charcoal-700 bg-gray-50 dark:bg-charcoal-900 focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Landmark</label>
                <input
                  type="text"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Pillar, Behind mall..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-charcoal-700 bg-gray-50 dark:bg-charcoal-900 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAddressModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-md"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
