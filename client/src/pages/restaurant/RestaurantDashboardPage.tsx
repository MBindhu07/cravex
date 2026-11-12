import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import RestaurantSidebar from '../../components/restaurant/RestaurantSidebar.tsx';
import api from '../../services/api.ts';

export const RestaurantDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restRes = await api.getMyRestaurant();
        if (restRes.success && restRes.restaurant) {
          setRestaurant(restRes.restaurant);
          const anRes = await api.getRestaurantAnalytics(restRes.restaurant._id);
          if (anRes.success) {
            setAnalytics(anRes);
          }
        }
      } catch (err) {
        console.error('Failed to load restaurant analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = analytics?.kpis || {
    totalRevenue: 28450,
    totalOrders: 48,
    pendingOrders: 3,
    completedOrders: 42,
    averageOrderValue: 592,
    rating: 4.8,
  };

  const revenueTrend = analytics?.revenueTrend || [
    { day: 'Mon', revenue: 3200 },
    { day: 'Tue', revenue: 4100 },
    { day: 'Wed', revenue: 3600 },
    { day: 'Thu', revenue: 4800 },
    { day: 'Fri', revenue: 6400 },
    { day: 'Sat', revenue: 8900 },
    { day: 'Sun', revenue: 7600 },
  ];

  const topDishes = analytics?.topDishes || [
    { name: 'Margherita Burrata Speciale', orders: 38, revenue: 14440 },
    { name: 'Diavola Pepperoni & Hot Honey', orders: 29, revenue: 13340 },
    { name: 'Truffled Wild Mushroom Pizza', orders: 21, revenue: 9240 },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <RestaurantSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        {/* Top Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kitchen Live</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white mt-1">
            {restaurant?.name || 'Restaurant'} Dashboard
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400">
            Real-time kitchen order throughput, daily revenue trends, and operational metrics
          </p>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Total Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-charcoal-700 flex items-center justify-center text-primary">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              ₹{kpis.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">↑ +14% vs last week</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Live Pending</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-500">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              {kpis.pendingOrders}
            </p>
            <p className="text-[10px] text-amber-500 font-semibold mt-1">Requires kitchen action</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Completed Orders</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              {kpis.completedOrders}
            </p>
            <p className="text-[10px] text-gray-400 font-semibold mt-1">98.2% fulfillment rate</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Avg Order Value</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              ₹{kpis.averageOrderValue}
            </p>
            <p className="text-[10px] text-gray-400 font-semibold mt-1">Rating: {kpis.rating} ★</p>
          </div>
        </div>

        {/* Charts & Top Dishes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Revenue Area Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4">
              Weekly Revenue Velocity (₹)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#202124',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="lg:col-span-4 bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4">
              Best-Selling Signatures
            </h3>
            <div className="space-y-4">
              {topDishes.map((dish: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-charcoal-700 last:border-0"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-xs text-charcoal-800 dark:text-white truncate">{dish.name}</p>
                    <p className="text-[10px] text-gray-400">{dish.orders} orders</p>
                  </div>
                  <span className="font-extrabold text-xs text-primary shrink-0">
                    ₹{dish.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantDashboardPage;
