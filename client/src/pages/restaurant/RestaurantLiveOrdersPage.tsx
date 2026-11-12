import React, { useState, useEffect } from 'react';
import {
  BellRing,
  CheckCircle2,
  XCircle,
  CookingPot,
  PackageCheck,
  Bike,
  Clock,
  Phone,
  AlertTriangle,
} from 'lucide-react';
import RestaurantSidebar from '../../components/restaurant/RestaurantSidebar.tsx';
import api from '../../services/api.ts';
import { getSocket, joinRestaurantRoom } from '../../services/socket.ts';
import { Order, OrderState } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const RestaurantLiveOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('rest-1');
  const [loading, setLoading] = useState(true);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen currently overwhelmed');
  const { addToast } = useNotifications();

  const fetchOrders = async () => {
    try {
      const restRes = await api.getMyRestaurant();
      if (restRes.success && restRes.restaurant) {
        setRestaurantId(restRes.restaurant._id);
        joinRestaurantRoom(restRes.restaurant._id);
        const ordersRes = await api.getRestaurantOrders(restRes.restaurant._id);
        if (ordersRes.success) {
          setOrders(ordersRes.orders || []);
        }
      }
    } catch (err) {
      console.error('Failed to load restaurant orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = getSocket();
    const handleNewOrder = (data: any) => {
      if (data.order) {
        setOrders((prev) => [data.order, ...prev]);
        addToast('New Live Order! 🔔', `Order #${data.order._id.slice(-6)} received!`, 'success');
      }
    };

    const handleStatusUpdate = (data: any) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === data.orderId ? { ...o, status: data.status } : o))
      );
    };

    socket.on('new_order_incoming', handleNewOrder);
    socket.on('order_status_updated', handleStatusUpdate);

    return () => {
      socket.off('new_order_incoming', handleNewOrder);
      socket.off('order_status_updated', handleStatusUpdate);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderState, note?: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, { status: nextStatus, note });
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? res.order : o)));
        addToast('Kitchen Status Updated 🍳', `Order status transitioned to ${nextStatus}`, 'success');
      }
    } catch (err: any) {
      addToast('Transition Blocked', err.message || 'Invalid state transition', 'warning');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingOrder) return;
    try {
      const res = await api.updateOrderStatus(rejectingOrder._id, {
        status: 'REJECTED',
        cancellationReason: rejectReason,
        note: rejectReason,
      });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === rejectingOrder._id ? { ...o, status: 'REJECTED' } : o))
        );
        addToast('Order Rejected', 'Customer has been notified.', 'info');
        setRejectingOrder(null);
      }
    } catch (err: any) {
      addToast('Error', err.message, 'error');
    }
  };

  // Filter only active orders for the live kitchen view
  const liveOrders = orders.filter(
    (o) => !['DELIVERED', 'CANCELLED', 'REJECTED'].includes(o.status)
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <RestaurantSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Live Incoming Kitchen Queue</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white mt-1">
              Live Order Management ({liveOrders.length})
            </h1>
            <p className="text-xs text-charcoal-500 dark:text-gray-400">
              Accept orders, trigger kitchen cooking state, and coordinate partner handovers
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="px-4 py-2 rounded-xl bg-orange-50 dark:bg-charcoal-800 text-primary font-bold text-xs hover:bg-orange-100 self-start sm:self-auto"
          >
            ↻ Refresh Queue
          </button>
        </div>

        {liveOrders.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-charcoal-800 rounded-3xl border border-dashed border-gray-200 dark:border-charcoal-700">
            <span className="text-5xl">🍳</span>
            <h3 className="font-bold text-base text-charcoal-800 dark:text-white mt-3">
              Kitchen Queue is Clear
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              New customer orders from the platform will chime here immediately via Socket.IO.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveOrders.map((order) => {
              const isPlaced = order.status === 'PLACED';
              const isConfirmed = order.status === 'RESTAURANT_CONFIRMED';
              const isPreparing = order.status === 'PREPARING';
              const isReady = order.status === 'FOOD_READY';
              const isAssigned = order.status === 'DELIVERY_ASSIGNED';

              return (
                <div
                  key={order._id}
                  className={`p-6 rounded-3xl bg-white dark:bg-charcoal-800 border transition-all ${
                    isPlaced
                      ? 'border-primary ring-2 ring-orange-200 dark:ring-orange-900 shadow-premium'
                      : 'border-orange-100 dark:border-charcoal-700 shadow-soft'
                  }`}
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-charcoal-700 mb-3">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-primary">
                        #{order._id.slice(-6)}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        isPlaced
                          ? 'bg-red-100 text-red-600 dark:bg-red-950 animate-pulse'
                          : isConfirmed
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950'
                          : isPreparing
                          ? 'bg-orange-100 text-primary dark:bg-orange-950'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="mb-4">
                    <p className="font-bold text-xs text-charcoal-800 dark:text-white">
                      Customer: {order.customerName}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Deliver to: {order.deliveryAddress?.addressLine}
                    </p>
                    {order.deliveryInstructions && (
                      <p className="text-[11px] text-orange-600 dark:text-orange-400 mt-1 italic">
                        Note: "{order.deliveryInstructions}"
                      </p>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-charcoal-750 border border-gray-100 dark:border-charcoal-700 space-y-2 mb-4">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <div className="font-semibold text-charcoal-800 dark:text-gray-200">
                          <span className="text-primary font-bold mr-1.5">{it.quantity}x</span>
                          <span>{it.name}</span>
                          {it.customizations?.size && (
                            <span className="text-[10px] text-gray-400 ml-1">
                              ({it.customizations.size})
                            </span>
                          )}
                        </div>
                        <span className="text-gray-500 font-mono">₹{it.itemTotal}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 dark:border-charcoal-600 flex justify-between font-bold text-xs text-charcoal-900 dark:text-white">
                      <span>Total Value ({order.payment.method}):</span>
                      <span>₹{order.pricing.total}</span>
                    </div>
                  </div>

                  {/* Operational Action Buttons (State Machine Transitions) */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isPlaced && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'RESTAURANT_CONFIRMED', 'Kitchen confirmed order')}
                          className="flex-grow py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                        >
                          ✓ Accept Order
                        </button>
                        <button
                          onClick={() => setRejectingOrder(order)}
                          className="py-2.5 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'PREPARING', 'Chefs baking order in kitchen')}
                        className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <CookingPot className="w-4 h-4" />
                        <span>Start Food Preparation</span>
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'FOOD_READY', 'Food packaged and hot')}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Mark Meal Packed & Food Ready</span>
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'DELIVERY_ASSIGNED', 'Assigned to nearest delivery partner')}
                        className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <Bike className="w-4 h-4" />
                        <span>Handover to Delivery Partner</span>
                      </button>
                    )}

                    {isAssigned && (
                      <div className="w-full p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-center text-xs font-bold text-purple-700 dark:text-purple-300">
                        🛵 Waiting for Partner {order.deliveryPartnerName || 'Pickup'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reject Reason Modal */}
        {rejectingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200">
              <h3 className="font-bold text-sm text-red-600 mb-2">Reject Order #{rejectingOrder._id.slice(-6)}</h3>
              <p className="text-xs text-gray-500 mb-4">Please specify a reason for the customer:</p>

              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 mb-4"
              >
                <option value="Kitchen currently overwhelmed">Kitchen currently overwhelmed</option>
                <option value="Ingredients temporarily out of stock">Ingredients temporarily out of stock</option>
                <option value="Closing time reached">Kitchen closing time reached</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRejectingOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RestaurantLiveOrdersPage;
