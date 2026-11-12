import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Plus, Minus, CheckCircle2 } from 'lucide-react';
import RestaurantSidebar from '../../components/restaurant/RestaurantSidebar.tsx';
import api from '../../services/api.ts';
import { InventoryItem } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const RestaurantInventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('rest-1');
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();

  const fetchInventory = async () => {
    try {
      const restRes = await api.getMyRestaurant();
      if (restRes.success && restRes.restaurant) {
        setRestaurantId(restRes.restaurant._id);
        const invRes = await api.getInventory(restRes.restaurant._id);
        if (invRes.success) {
          setInventory(invRes.inventory || []);
        }
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustStock = async (item: InventoryItem, delta: number) => {
    const nextQty = Math.max(0, item.quantity + delta);
    try {
      const res = await api.updateInventoryItem(item._id, { quantity: nextQty });
      if (res.success && res.inventoryItem) {
        setInventory((prev) =>
          prev.map((it) => (it._id === item._id ? res.inventoryItem : it))
        );

        if (nextQty <= item.lowStockThreshold && nextQty > 0) {
          addToast(
            'Low Stock Warning ⚠️',
            `${item.ingredientName} is low on stock (${nextQty} ${item.unit})`,
            'warning'
          );
        } else if (nextQty === 0) {
          addToast(
            'Ingredient Depleted 🚫',
            `${item.ingredientName} reached 0. Related menu dishes have been marked Out of Stock automatically.`,
            'error'
          );
        } else {
          addToast('Stock Adjusted', `${item.ingredientName} updated to ${nextQty} ${item.unit}`, 'info');
        }
      }
    } catch (err: any) {
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <RestaurantSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Raw Material Tracking</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white mt-1">
            Kitchen Inventory & Stock
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400">
            Real-time ingredient usage tracking. Disables menu items automatically when core ingredients deplete to zero.
          </p>
        </div>

        {/* Stock List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => {
            const isLow = item.quantity <= item.lowStockThreshold && item.quantity > 0;
            const isZero = item.quantity === 0;

            return (
              <div
                key={item._id}
                className={`p-6 rounded-3xl bg-white dark:bg-charcoal-800 border transition-all ${
                  isZero
                    ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20 shadow-sm'
                    : isLow
                    ? 'border-amber-400 bg-amber-50/20 dark:bg-amber-950/20 shadow-sm'
                    : 'border-orange-100 dark:border-charcoal-700 shadow-soft'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-sm text-charcoal-900 dark:text-white">
                    {item.ingredientName}
                  </h4>
                  {isZero ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                      Depleted
                    </span>
                  ) : isLow ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Optimal
                    </span>
                  )}
                </div>

                <div className="my-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-3xl text-charcoal-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <span className="text-xs text-gray-500 font-bold">{item.unit}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Alert Threshold: {item.lowStockThreshold} {item.unit}
                  </p>
                </div>

                {/* Quick Add/Deduct Buttons */}
                <div className="pt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Quick Adjust</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAdjustStock(item, -5)}
                      className="p-1.5 rounded-xl border border-gray-200 dark:border-charcoal-600 hover:bg-gray-100 dark:hover:bg-charcoal-700 text-charcoal-700 dark:text-gray-200 text-xs font-bold"
                    >
                      -5 {item.unit}
                    </button>
                    <button
                      onClick={() => handleAdjustStock(item, 5)}
                      className="p-1.5 rounded-xl bg-orange-50 dark:bg-charcoal-700 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-colors"
                    >
                      +5 {item.unit}
                    </button>
                    <button
                      onClick={() => handleAdjustStock(item, 25)}
                      className="p-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 transition-colors"
                    >
                      +25 {item.unit}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default RestaurantInventoryPage;
