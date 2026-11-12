import React, { useState, useEffect } from 'react';
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import api from '../../services/api.ts';

const PIE_COLORS = ['#FF6B35', '#FFAA8C', '#28A745', '#FFD166', '#845EC2'];

export const AdminOverviewPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const res = await api.getAdminOverview();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOverview();
  }, []);

  const stats = data?.stats || {
    totalUsers: 24,
    totalCustomers: 18,
    totalOwners: 4,
    totalDeliveryPartners: 2,
    totalRestaurants: 12,
    totalOrders: 64,
    totalGrossGMV: 42800,
    platformCommission: 6420,
    commissionRate: '15%',
  };

  const monthlyAnalytics = data?.monthlyAnalytics || [
    { month: 'Jun', gmv: 18000, revenue: 2700 },
    { month: 'Jul', gmv: 24000, revenue: 3600 },
    { month: 'Aug', gmv: 31000, revenue: 4650 },
    { month: 'Sep', gmv: 38000, revenue: 5700 },
    { month: 'Oct', gmv: 42000, revenue: 6300 },
    { month: 'Nov', gmv: 48000, revenue: 7200 },
  ];

  const cuisineStats = data?.cuisineStats || [
    { name: 'Biryani & Indian', value: 38 },
    { name: 'Gourmet Pizzas', value: 24 },
    { name: 'Burgers & Shakes', value: 18 },
    { name: 'Pan-Asian & Dimsums', value: 12 },
    { name: 'Desserts & Healthy', value: 8 },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
            Super Administrator Control Center
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400">
            Platform GMV, 15% commission revenue, merchant onboarding, and cross-dashboard ecosystem monitoring
          </p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-purple-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Gross GMV</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              ₹{stats.totalGrossGMV.toLocaleString()}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">↑ +22% Platform Growth</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-purple-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Platform Commission</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-emerald-600">
              ₹{stats.platformCommission.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 font-semibold mt-1">15% net revenue fee</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-purple-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Total Users</span>
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-charcoal-700 flex items-center justify-center text-primary">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              {stats.totalUsers}
            </p>
            <p className="text-[10px] text-gray-400 font-semibold mt-1">{stats.totalCustomers} Customers • {stats.totalOwners} Owners</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-purple-100 dark:border-charcoal-700 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">Restaurants</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-500">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <p className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              {stats.totalRestaurants}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">100% Verified Partners</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Revenue Analytics Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-purple-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4">
              Monthly Platform Growth & Commission Intake
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyAnalytics}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#845EC2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#845EC2" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#202124',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    name="Gross GMV (₹)"
                    stroke="#845EC2"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorGmv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Commission (₹)"
                    stroke="#28A745"
                    strokeWidth={2}
                    fillOpacity={0.5}
                    fill="#28A745"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cuisines Share Pie Chart */}
          <div className="lg:col-span-4 bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-purple-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4">
              Popular Cuisine Share (%)
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cuisineStats}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cuisineStats.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 text-xs mt-2">
              {cuisineStats.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-gray-600 dark:text-gray-300">{c.name}</span>
                  </div>
                  <span className="font-bold text-charcoal-800 dark:text-white">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOverviewPage;
