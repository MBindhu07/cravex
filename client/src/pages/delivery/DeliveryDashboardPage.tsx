import React, { useState, useEffect } from 'react';
import {
  Bike,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Star,
  Power,
} from 'lucide-react';
import api from '../../services/api.ts';
import { Order } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const DeliveryDashboardPage: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeDeliveries, setActiveDeliveries] = useState<Order[]>([]);
  const [availableDeliveries, setAvailableDeliveries] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>({
    totalDeliveries: 18,
    todayEarnings: 650,
    weeklyEarnings: 3200,
    rating: 4.9,
  });

  // OTP Modal state for delivery completion
  const [otpModalOrder, setOtpModalOrder] = useState<Order | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToast } = useNotifications();

  const fetchDeliveryData = async () => {
    try {
      const [myRes, availRes, statsRes] = await Promise.all([
        api.getMyDeliveries(),
        api.getAvailableDeliveries(),
        api.getDeliveryStats(),
      ]);

      if (myRes.success) {
        setActiveDeliveries(myRes.activeDeliveries || []);
      }
      if (availRes.success) {
        setAvailableDeliveries(availRes.orders || []);
      }
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load delivery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const handleAcceptDelivery = async (orderId: string) => {
    try {
      const res = await api.acceptDelivery(orderId);
      if (res.success) {
        addToast('Assignment Accepted! 🛵', 'Head to the restaurant for food pickup.', 'success');
        fetchDeliveryData();
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Cannot accept assignment', 'error');
    }
  };

  const handleUpdateStep = async (orderId: string, nextStatus: string, otp?: string) => {
    try {
      const res = await api.updateDeliveryStep(orderId, nextStatus, otp);
      if (res.success) {
        addToast('Delivery Step Updated 📍', `Order is now: ${nextStatus}`, 'success');
        if (nextStatus === 'DELIVERED') {
          setOtpModalOrder(null);
          setEnteredOtp('');
        }
        fetchDeliveryData();
      }
    } catch (err: any) {
      addToast('Verification Failed', err.message || 'Invalid status update', 'error');
    }
  };

  // Simulate GPS coordinates moving
  const handleSimulateGPSMove = async (orderId: string) => {
    const randomLat = 12.9716 + (Math.random() - 0.5) * 0.02;
    const randomLng = 77.5946 + (Math.random() - 0.5) * 0.02;

    try {
      await api.updateDeliveryLocation(orderId, randomLat, randomLng);
      addToast('GPS Coordinate Broadcasted 📡', 'Customer tracking map updated.', 'info');
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header & Availability Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Delivery Partner Portal
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white mt-1">
            Vikram Singh (Rider Dashboard)
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400">
            Ather 450X Electric • Bengaluru Central Zone
          </p>
        </div>

        {/* Availability Toggle */}
        <button
          onClick={() => {
            setIsOnline(!isOnline);
            addToast(
              isOnline ? 'Rider Offline' : 'Rider Online 🟢',
              isOnline ? 'You will not receive new order broadcasts.' : 'Ready to accept order dispatches!',
              isOnline ? 'info' : 'success'
            );
          }}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto ${
            isOnline
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-200 dark:bg-charcoal-700 text-gray-500'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'ONLINE • ACCEPTING JOBS' : 'OFFLINE'}</span>
        </button>
      </div>

      {/* Rider KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">Today's Payout</p>
          <p className="font-display font-extrabold text-2xl text-emerald-600 mt-1">
            ₹{stats.todayEarnings}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">₹65 per completed delivery</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">Completed Deliveries</p>
          <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white mt-1">
            {stats.totalDeliveries}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">98% on-time rate</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">Weekly Total</p>
          <p className="font-display font-extrabold text-2xl text-primary mt-1">
            ₹{stats.weeklyEarnings}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Direct deposit active</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">Customer Rating</p>
          <p className="font-display font-extrabold text-2xl text-amber-500 mt-1 flex items-center gap-1">
            <span>{stats.rating}</span>
            <Star className="w-5 h-5 fill-amber-500" />
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Hero Partner Status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active In-Transit Orders with Lifecycle Steps */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>My Active Deliveries ({activeDeliveries.length})</span>
            </h3>

            {activeDeliveries.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">
                No active delivery at this moment. Review available orders on the right to accept assignments!
              </p>
            ) : (
              <div className="space-y-6">
                {activeDeliveries.map((order) => {
                  const isAssigned = order.status === 'DELIVERY_ASSIGNED';
                  const isPickedUp = order.status === 'PICKED_UP';
                  const isOutForDelivery = order.status === 'OUT_FOR_DELIVERY';

                  return (
                    <div
                      key={order._id}
                      className="p-5 rounded-2xl bg-orange-50/50 dark:bg-charcoal-750 border border-orange-200/60 dark:border-charcoal-600 space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-orange-200/50 dark:border-charcoal-600">
                        <div>
                          <span className="font-mono font-extrabold text-xs text-primary">
                            Order #{order._id.slice(-6)}
                          </span>
                          <p className="font-bold text-sm text-charcoal-800 dark:text-white mt-0.5">
                            {order.restaurantName}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-primary text-white">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Pick up & Drop destinations */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="text-sm">🏪</span>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400">Pickup</p>
                            <p className="font-semibold text-charcoal-700 dark:text-gray-200">
                              {order.restaurantAddress || order.restaurantName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-sm">📍</span>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400">Customer Drop</p>
                            <p className="font-semibold text-charcoal-700 dark:text-gray-200">
                              {order.customerName} • {order.deliveryAddress?.addressLine}
                            </p>
                            {order.deliveryInstructions && (
                              <p className="text-[11px] text-orange-600 dark:text-orange-400 italic">
                                "{order.deliveryInstructions}"
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Lifecycle Transition Action Buttons */}
                      <div className="pt-3 border-t border-orange-200/50 dark:border-charcoal-600 flex flex-wrap gap-2">
                        {isAssigned && (
                          <button
                            onClick={() => handleUpdateStep(order._id, 'PICKED_UP')}
                            className="flex-grow py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>1. Order Picked Up from Kitchen</span>
                          </button>
                        )}

                        {isPickedUp && (
                          <button
                            onClick={() => handleUpdateStep(order._id, 'OUT_FOR_DELIVERY')}
                            className="flex-grow py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <Bike className="w-4 h-4" />
                            <span>2. Start Transit (Out for Delivery)</span>
                          </button>
                        )}

                        {isOutForDelivery && (
                          <button
                            onClick={() => setOtpModalOrder(order)}
                            className="flex-grow py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>3. Verify Customer OTP & Complete Delivery</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleSimulateGPSMove(order._id)}
                          className="px-3 py-2.5 rounded-xl border border-gray-300 dark:border-charcoal-600 text-gray-600 dark:text-gray-300 hover:bg-white text-xs font-bold flex items-center gap-1"
                          title="Simulate GPS move along route"
                        >
                          <Navigation className="w-3.5 h-3.5 text-primary" />
                          <span>Ping GPS</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Available Orders Broadcast Queue */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Available Assignments ({availableDeliveries.length})</span>
              <span className="text-xs text-primary font-bold">Earn ₹65 / order</span>
            </h3>

            {availableDeliveries.length === 0 ? (
              <p className="text-xs text-gray-400 py-8 text-center">
                All live orders currently assigned. New kitchen calls will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {availableDeliveries.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-charcoal-750 border border-gray-100 dark:border-charcoal-700 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-charcoal-800 dark:text-white">
                          {order.restaurantName}
                        </h4>
                        <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                          To: {order.deliveryAddress?.addressLine}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-xs text-emerald-600">+₹65 payout</span>
                    </div>

                    <button
                      onClick={() => handleAcceptDelivery(order._id)}
                      className="w-full py-2 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Accept Assignment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-orange-100 dark:border-charcoal-700 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display font-extrabold text-base text-charcoal-900 dark:text-white">
              Verify Customer Handover
            </h3>
            <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1 mb-4">
              Ask customer <strong>{otpModalOrder.customerName}</strong> for their 4-digit security code.
            </p>

            <input
              type="text"
              maxLength={4}
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="e.g. 7482"
              className="w-40 mx-auto px-4 py-3 rounded-2xl bg-gray-50 dark:bg-charcoal-700 border-2 border-primary font-mono text-center text-xl font-black tracking-widest text-charcoal-900 dark:text-white focus:outline-none mb-4"
            />

            <div className="flex justify-center gap-2">
              <button
                onClick={() => setOtpModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStep(otpModalOrder._id, 'DELIVERED', enteredOtp)}
                disabled={enteredOtp.length !== 4}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold shadow-md"
              >
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboardPage;
