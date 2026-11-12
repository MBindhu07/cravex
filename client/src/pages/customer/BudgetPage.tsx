import React, { useState, useEffect } from 'react';
import { Wallet, Sparkles, Plus, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../../services/api.ts';
import FoodCustomizationModal from '../../components/customer/FoodCustomizationModal.tsx';
import { FoodItem } from '../../types/index.ts';

export const BudgetPage: React.FC = () => {
  const [budget, setBudget] = useState<number>(300);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);

  const fetchBudgetCombos = async () => {
    setLoading(true);
    try {
      const res = await api.getBudgetMeals(budget);
      if (res.success) {
        setCombos(res.matches || []);
      }
    } catch (err) {
      console.error('Budget combos error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetCombos();
  }, [budget]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3 shadow-xs">
          <Wallet className="w-3.5 h-3.5" />
          <span>Smart Budget Optimization Engine</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900 dark:text-white">
          "I Have ₹{budget} for Dinner"
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-gray-400 mt-2">
          Tell us your budget cap. We calculate item price, 5% taxes, and delivery fee to ensure your bill never crosses your limit.
        </p>

        {/* Budget Slider and Quick Presets */}
        <div className="mt-6 max-w-md mx-auto bg-white dark:bg-charcoal-800 p-5 rounded-3xl border border-orange-100 dark:border-charcoal-700 shadow-soft space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-charcoal-500">Selected Budget Limit</span>
            <span className="text-lg font-black text-primary">₹{budget}</span>
          </div>

          <input
            type="range"
            min="150"
            max="800"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />

          <div className="flex justify-between gap-2 pt-2">
            {[180, 250, 300, 450, 600].map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  budget === b
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-gray-50 dark:bg-charcoal-700 text-charcoal-700 dark:text-gray-300 border-gray-200 dark:border-charcoal-600'
                }`}
              >
                ₹{b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Combos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse" />
          ))}
        </div>
      ) : combos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-charcoal-800 rounded-3xl border border-dashed border-gray-200 dark:border-charcoal-700">
          <p className="text-sm font-semibold text-gray-500">No combos fit within ₹{budget}.</p>
          <p className="text-xs text-gray-400 mt-1">Try increasing your budget slider slightly!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map(({ dish, restaurant, breakdown }) => (
            <div
              key={dish._id}
              className="bg-white dark:bg-charcoal-800 rounded-3xl p-5 border border-orange-100 dark:border-charcoal-700 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-charcoal-700 mb-3.5">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                    {restaurant?.name || 'Gourmet Kitchen'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-sm text-charcoal-900 dark:text-white truncate">
                    {dish.name}
                  </h4>
                  <span className="text-xs font-black text-emerald-600 shrink-0">
                    ₹{breakdown.total} all-in
                  </span>
                </div>

                {/* All-in cost breakdown */}
                <div className="p-3 mt-3 rounded-2xl bg-orange-50/60 dark:bg-charcoal-750 border border-orange-100/60 dark:border-charcoal-700 space-y-1 text-[11px] text-charcoal-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Dish Price:</span>
                    <span className="font-semibold">₹{breakdown.itemPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span className="font-semibold">₹{breakdown.taxes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">₹{breakdown.deliveryFee}</span>
                  </div>
                  <div className="pt-1 border-t border-orange-200/50 dark:border-charcoal-600 flex justify-between font-bold text-emerald-600">
                    <span>Remaining Wallet:</span>
                    <span>₹{breakdown.savings} under cap</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedFoodForModal(dish)}
                className="w-full mt-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Customize & Order (₹{breakdown.total})</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFoodForModal && (
        <FoodCustomizationModal
          food={selectedFoodForModal}
          isOpen={!!selectedFoodForModal}
          onClose={() => setSelectedFoodForModal(null)}
        />
      )}
    </div>
  );
};

export default BudgetPage;
