import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import api from '../../services/api.ts';
import { Order } from '../../types/index.ts';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.getAllOrdersAdmin({
        status: statusFilter,
        search,
      });
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
            Platform Order Monitoring ({orders.length})
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400">
            Real-time cross-kitchen tracking, lifecycle bottlenecks, and customer order fulfillment
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-4 border border-purple-100 dark:border-charcoal-700 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-soft">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID or Customer..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-700 text-xs focus:outline-none focus:border-purple-500"
            />
          </form>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['ALL', 'PLACED', 'PREPARING', 'FOOD_READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors shrink-0 ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-gray-50 dark:bg-charcoal-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-purple-100 dark:border-charcoal-700 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-charcoal-750 text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-charcoal-700">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Restaurant</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-charcoal-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-charcoal-750/50">
                    <td className="px-6 py-4 font-mono font-bold text-primary">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-charcoal-900 dark:text-white">
                      {order.restaurantName}
                    </td>
                    <td className="px-6 py-4">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-charcoal-900 dark:text-white">
                      ₹{order.pricing.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : order.status === 'CANCELLED' || order.status === 'REJECTED'
                            ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300'
                            : 'bg-orange-50 text-primary dark:bg-orange-950'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/order-tracking/${order._id}`}
                        className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-charcoal-700 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white font-bold text-xs transition-colors"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
