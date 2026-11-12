import React, { useState } from 'react';
import { Percent, Plus, Tag, Calendar, Check } from 'lucide-react';
import RestaurantSidebar from '../../components/restaurant/RestaurantSidebar.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const RestaurantPromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 'p1',
      title: 'Weekend Pizza Fiesta',
      code: 'CRAVEFEST',
      discount: '20% OFF',
      minOrder: '₹299',
      active: true,
      validUntil: 'Every Fri-Sun',
    },
    {
      id: 'p2',
      title: 'First Bite Welcome',
      code: 'FIRST50',
      discount: '50% OFF',
      minOrder: '₹199',
      active: true,
      validUntil: 'Dec 31, 2026',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('15');
  const [minOrder, setMinOrder] = useState('250');
  const { addToast } = useNotifications();

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    setPromotions((prev) => [
      ...prev,
      {
        id: `p_${Date.now()}`,
        title,
        code: code.toUpperCase(),
        discount: `${discount}% OFF`,
        minOrder: `₹${minOrder}`,
        active: true,
        validUntil: 'Active Next 30 Days',
      },
    ]);

    addToast('Promotion Launched! 🏷️', `Campaign code ${code.toUpperCase()} is now live.`, 'success');
    setShowModal(false);
    setTitle('');
    setCode('');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <RestaurantSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Restaurant Marketing</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white mt-1">
              Promotions & Vouchers
            </h1>
            <p className="text-xs text-charcoal-500 dark:text-gray-400">
              Create special discounts and limited-time deals to attract hungry gastronomes
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs flex items-center gap-1.5 hover:bg-primary-600 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Campaign</span>
          </button>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border-2 border-dashed border-orange-200 dark:border-charcoal-700 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-extrabold text-sm text-primary tracking-wider">
                    {promo.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px]">
                    ● Active
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-charcoal-800 dark:text-white">
                  {promo.title}
                </h4>
                <p className="text-xs text-emerald-600 font-bold mt-1">{promo.discount} on orders above {promo.minOrder}</p>
                <p className="text-[11px] text-gray-400 mt-2">Validity: {promo.validUntil}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-gray-100 dark:border-charcoal-700 flex justify-end">
                <span className="text-xs text-gray-400 font-medium">Automatic platform checkout redemption</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 dark:border-charcoal-700">
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-4">
                Launch Restaurant Promo
              </h3>
              <form onSubmit={handleCreatePromo} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Campaign Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sourdough Weekend Bonanza"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Promo Code</label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="PIZZA20"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      required
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
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
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600"
                  >
                    Publish Offer
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

export default RestaurantPromotionsPage;
