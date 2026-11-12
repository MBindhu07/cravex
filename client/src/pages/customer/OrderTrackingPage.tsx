import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bike,
  Phone,
  ShieldCheck,
  Store,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api.ts';
import { getSocket, joinOrderRoom, leaveOrderRoom } from '../../services/socket.ts';
import { Order } from '../../types/index.ts';
import OrderTimeline from '../../components/customer/OrderTimeline.tsx';
import InteractiveMapSim from '../../components/customer/InteractiveMapSim.tsx';
import { triggerPartyConfetti } from '../../components/common/ConfettiCelebration.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);
  const { addToast } = useNotifications();

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const res = await api.getOrderById(id);
      if (res.success && res.order) {
        setOrder(res.order);
        if (res.order.status === 'DELIVERED' && !hasCelebrated) {
          triggerPartyConfetti();
          setHasCelebrated(true);
        }
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Socket.IO real-time subscription
    if (id) {
      joinOrderRoom(id);
      const socket = getSocket();

      const handleStatusUpdate = (data: any) => {
        if (data.order) {
          setOrder(data.order);
          if (data.order.status === 'DELIVERED' && !hasCelebrated) {
            triggerPartyConfetti();
            setHasCelebrated(true);
            addToast('Delivered! 🎉', 'Your meal has arrived! Enjoy your feast.', 'success');
          }
        }
      };

      const handleLocationUpdate = (data: any) => {
        setOrder((prev) =>
          prev
            ? {
                ...prev,
                deliveryPartnerLocation: { lat: data.lat, lng: data.lng },
              }
            : null
        );
      };

      socket.on('order_status_updated', handleStatusUpdate);
      socket.on('delivery_location_updated', handleLocationUpdate);

      return () => {
        leaveOrderRoom(id);
        socket.off('order_status_updated', handleStatusUpdate);
        socket.off('delivery_location_updated', handleLocationUpdate);
      };
    }
  }, [id, hasCelebrated]);

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirm = window.confirm('Are you sure you want to cancel this order?');
    if (!confirm) return;

    try {
      const res = await api.cancelOrder(order._id, 'Cancelled by customer');
      if (res.success) {
        setOrder(res.order);
        addToast('Order Cancelled', 'Your order was cancelled successfully.', 'info');
      }
    } catch (err: any) {
      addToast('Cannot Cancel', err.message || 'Order preparation already underway', 'warning');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse mb-6" />
        <div className="h-44 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link to="/restaurants" className="mt-4 inline-block text-primary font-semibold text-xs">
          ← Back to food exploration
        </Link>
      </div>
    );
  }

  const canCancel = order.status === 'PLACED' || order.status === 'RESTAURANT_CONFIRMED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-primary transition-colors mb-2 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All My Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
              Order #{order._id.slice(-6)}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                order.status === 'DELIVERED'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : order.status === 'CANCELLED' || order.status === 'REJECTED'
                  ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                  : 'bg-orange-100 dark:bg-orange-950 text-primary animate-pulse'
              }`}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
            Placed from <strong className="text-charcoal-800 dark:text-gray-200">{order.restaurantName}</strong> • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {canCancel && (
          <button
            onClick={handleCancelOrder}
            className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Main Grid: Interactive Map + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Map & Delivery Partner Card */}
        <div className="lg:col-span-7 space-y-6">
          <InteractiveMapSim
            status={order.status}
            restaurantName={order.restaurantName}
            customerAddress={order.deliveryAddress?.addressLine || 'Indiranagar, Bengaluru'}
            partnerLocation={order.deliveryPartnerLocation}
          />

          {/* Delivery Partner Assigned Card */}
          {order.deliveryPartnerName && (
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-5 border border-orange-100 dark:border-charcoal-700 shadow-soft flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-charcoal-700 flex items-center justify-center text-2xl">
                  🛵
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-charcoal-800 dark:text-white">
                      {order.deliveryPartnerName}
                    </h4>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded-md">
                      4.9 ★ Hero
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">Your dedicated delivery champion</p>
                </div>
              </div>

              {order.deliveryPartnerPhone && (
                <a
                  href={`tel:${order.deliveryPartnerPhone}`}
                  className="px-4 py-2 rounded-xl bg-orange-50 dark:bg-charcoal-700 text-primary font-bold text-xs flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider</span>
                </a>
              )}
            </div>
          )}

          {/* Items Summary in this Order */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-charcoal-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-100 dark:border-charcoal-700">
              Ordered Items
            </h4>

            <div className="space-y-3">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-charcoal-800 dark:text-white">{it.quantity}x</span>
                    <span className="text-charcoal-700 dark:text-gray-300">{it.name}</span>
                    {it.customizations?.size && (
                      <span className="text-[10px] text-gray-400">({it.customizations.size})</span>
                    )}
                  </div>
                  <span className="font-bold text-charcoal-900 dark:text-white">₹{it.itemTotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-charcoal-700 flex justify-between font-display font-extrabold text-sm text-charcoal-900 dark:text-white">
              <span>Total Paid ({order.payment.method})</span>
              <span className="text-primary font-black text-base">₹{order.pricing.total}</span>
            </div>
          </div>
        </div>

        {/* Right: State Machine Timeline & OTP */}
        <div className="lg:col-span-5 space-y-6">
          <OrderTimeline
            currentStatus={order.status}
            statusHistory={order.statusHistory}
            deliveryOtp={order.deliveryOtp}
          />

          {/* Help box */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-charcoal-850 border border-gray-200 dark:border-charcoal-700 text-center">
            <p className="text-xs text-charcoal-600 dark:text-gray-300">
              Need assistance with this order?
            </p>
            <Link
              to="/support"
              className="mt-2 inline-block text-xs font-bold text-primary hover:underline"
            >
              Contact 24/7 CraveX Care Team ⟶
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
