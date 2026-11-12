import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, RotateCw, Clock, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api.ts';
import { Order } from '../../types/index.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, clearCart } = useCart();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReorder = (order: Order) => {
    clearCart();
    // Add all verified items to cart
    order.items.forEach((item) => {
      addItem(
        {
          _id: item.foodItemId,
          name: item.name,
          price: item.price,
          restaurantId: order.restaurantId,
          restaurantName: order.restaurantName,
          image: item.image,
          isVeg: item.isVeg,
          description: '',
          category: 'Mains',
          available: true,
        },
        {
          size: item.customizations?.size ? { name: item.customizations.size, price: 0 } : undefined,
          spiceLevel: item.customizations?.spiceLevel,
        },
        item.quantity
      );
    });

    addToast('Reorder Added to Cart! 🛒', `Items from ${order.restaurantName} added to your cart.`, 'success');
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
          My Order History
        </h1>
        <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
          Track active orders or reorder your favorite meals in 1-click
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-charcoal-800 rounded-3xl border border-dashed border-gray-200 dark:border-charcoal-700">
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-charcoal-750 flex items-center justify-center mx-auto mb-4 text-3xl">
            📦
          </div>
          <h3 className="font-bold text-base text-charcoal-800 dark:text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Ready to order something delicious? Explore our top restaurants!
          </p>
          <Link
            to="/restaurants"
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md"
          >
            <span>Explore Restaurants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const isActive = order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'REJECTED';

            return (
              <div
                key={order._id}
                className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft hover:shadow-premium transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-charcoal-700 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-base text-charcoal-800 dark:text-white">
                        {order.restaurantName}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : isActive
                            ? 'bg-orange-100 dark:bg-orange-950 text-primary animate-pulse'
                            : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Order #{order._id.slice(-6)} • {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <span className="font-display font-extrabold text-base text-charcoal-900 dark:text-white self-start sm:self-auto">
                    ₹{order.pricing.total}
                  </span>
                </div>

                {/* Items preview */}
                <div className="py-4 space-y-1.5 text-xs text-charcoal-600 dark:text-gray-300">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-semibold">₹{it.itemTotal}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Action buttons */}
                <div className="pt-3 border-t border-gray-100 dark:border-charcoal-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-gray-500">
                    Paid via <strong>{order.payment.method}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/order-tracking/${order._id}`}
                      className="px-4 py-2 rounded-xl bg-orange-50 dark:bg-charcoal-700 text-primary font-bold text-xs hover:bg-orange-100 dark:hover:bg-charcoal-600 transition-colors"
                    >
                      {isActive ? 'Track Live State 🛵' : 'View Summary'}
                    </Link>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-primary-600 shadow-sm transition-all active:scale-95"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Reorder in 1-Click</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
