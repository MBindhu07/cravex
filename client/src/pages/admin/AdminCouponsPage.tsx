import React, { useState, useEffect } from 'react';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import api from '../../services/api.ts';
import { Coupon } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrder, setMinOrder] = useState('250');
  const [maxDiscount, setMaxDiscount] = useState('150');
  const { addToast } = useNotifications();

  const fetchCoupons = async () => {
    try {
      const res = await api.getCouponsAdmin();
      if (res.success) {
        setCoupons(res.coupons || []);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    try {
      const res = await api.createCouponAdmin({
        code,
        discountType,
        discountValue,
        minOrder,
        maxDiscount,
      });

      if (res.success) {
        addToast('Coupon Created! 🏷️', `Promo ${code.toUpperCase()} is now live.`, 'success');
        setShowModal(false);
        setCode('');
        fetchCoupons();
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to create coupon', 'error');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
              Platform Coupons & Promos ({coupons.length})
            </h1>
            <p className="text-xs text-charcoal-500 dark:text-gray-400">
              Configure platform-wide discount codes, minimum basket thresholds, and max savings
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Coupon</span>
          </button>
        </div>

        {/* Coupons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border-2 border-dashed border-purple-200 dark:border-charcoal-700 shadow-soft"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-extrabold text-sm text-purple-600 dark:text-purple-400 tracking-wider">
                  {coupon.code}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-extrabold">
                  ● Active
                </span>
              </div>

              <div className="my-3">
                <p className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                </p>
                <p className="text-xs text-gray-500 mt-1">Min Order: ₹{coupon.minOrder}</p>
                {coupon.maxDiscount && (
                  <p className="text-[11px] text-gray-400">Max Discount: ₹{coupon.maxDiscount}</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-charcoal-700 flex justify-between text-[11px] text-gray-400">
                <span>Usage: {coupon.usageCount || 0} times</span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 dark:border-charcoal-700">
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-4">
                Create Platform Coupon
              </h3>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="FEAST25"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 uppercase font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Discount Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="20"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      value={minOrder}
                      onChange={(e) => setMinOrder(e.target.value)}
                      placeholder="250"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      placeholder="150"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                  >
                    Create Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCouponsPage;
