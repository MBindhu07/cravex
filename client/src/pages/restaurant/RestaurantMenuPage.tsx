import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Flame } from 'lucide-react';
import RestaurantSidebar from '../../components/restaurant/RestaurantSidebar.tsx';
import api from '../../services/api.ts';
import { FoodItem } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const RestaurantMenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('rest-1');
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Gourmet Pizzas');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [prepTime, setPrepTime] = useState('20');
  const [spiceLevel, setSpiceLevel] = useState('Mild');

  const { addToast } = useNotifications();

  const fetchMenu = async () => {
    try {
      const restRes = await api.getMyRestaurant();
      if (restRes.success && restRes.restaurant) {
        setRestaurantId(restRes.restaurant._id);
        setMenuItems(restRes.menuItems || []);
      }
    } catch (err) {
      console.error('Failed to load menu:', err);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setPrice('');
    setCategory('Gourmet Pizzas');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80');
    setIsVeg(true);
    setPrepTime('20');
    setSpiceLevel('Medium');
    setShowItemModal(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(String(item.price));
    setCategory(item.category);
    setDescription(item.description);
    setImage(item.image);
    setIsVeg(item.isVeg);
    setPrepTime(String(item.preparationTime || 20));
    setSpiceLevel(item.spiceLevel || 'Medium');
    setShowItemModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    try {
      if (editingItem) {
        const res = await api.updateFoodItem(editingItem._id, {
          name,
          price: Number(price),
          category,
          description,
          image,
          isVeg,
          preparationTime: Number(prepTime),
          spiceLevel,
        });
        if (res.success) {
          addToast('Dish Updated', `${name} updated on your menu.`, 'success');
        }
      } else {
        const res = await api.addFoodItem({
          restaurantId,
          name,
          price: Number(price),
          category,
          description,
          image,
          isVeg,
          preparationTime: Number(prepTime),
          spiceLevel,
        });
        if (res.success) {
          addToast('Dish Created 🎉', `${name} added to your live menu.`, 'success');
        }
      }
      setShowItemModal(false);
      fetchMenu();
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to save menu item', 'error');
    }
  };

  const handleDeleteItem = async (id: string, itemName: string) => {
    const confirm = window.confirm(`Are you sure you want to delete ${itemName} from your menu?`);
    if (!confirm) return;

    try {
      await api.deleteFoodItem(id);
      addToast('Dish Removed', `${itemName} deleted from menu.`, 'info');
      fetchMenu();
    } catch (err: any) {
      addToast('Error', err.message, 'error');
    }
  };

  const handleToggleAvailability = async (item: FoodItem) => {
    try {
      await api.updateFoodItem(item._id, { available: !item.available });
      setMenuItems((prev) =>
        prev.map((it) => (it._id === item._id ? { ...it, available: !it.available } : it))
      );
      addToast(
        'Availability Updated',
        `${item.name} is now ${!item.available ? 'AVAILABLE' : 'OUT OF STOCK'}`,
        'info'
      );
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <RestaurantSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
              Menu Management ({menuItems.length})
            </h1>
            <p className="text-xs text-charcoal-500 dark:text-gray-400">
              Create signature dishes, configure sizes and pricing, and toggle instant item availability
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>

        {/* Menu Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-3xl bg-white dark:bg-charcoal-800 border transition-all flex flex-col justify-between ${
                item.available
                  ? 'border-orange-100 dark:border-charcoal-700 shadow-soft'
                  : 'border-gray-200 dark:border-charcoal-700 opacity-60'
              }`}
            >
              <div>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-charcoal-700 mb-3">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center font-extrabold text-xs text-red-400 uppercase tracking-wider">
                      Out of Stock
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-charcoal-800">
                    {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-charcoal-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <span className="font-display font-extrabold text-sm text-primary shrink-0">
                    ₹{item.price}
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2">
                  <span>Category: {item.category}</span>
                  <span>•</span>
                  <span>Prep: {item.preparationTime}m</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                    item.available
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-red-50 text-red-600 border-red-300 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {item.available ? 'In Stock' : 'Mark In Stock'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-primary hover:bg-orange-50 dark:hover:bg-charcoal-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id, item.name)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-charcoal-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-100 dark:border-charcoal-700 max-h-[90vh] overflow-y-auto">
              <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-4">
                {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
              </h3>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                    Food Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sourdough Burrata Margherita"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="380"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Gourmet Pizzas"
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe ingredients, cooking method, flavors..."
                    className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700 focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                      Dietary Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsVeg(true)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${isVeg ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      >
                        Veg
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsVeg(false)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${!isVeg ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      >
                        Non-Veg
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                      Prep Time (Minutes)
                    </label>
                    <input
                      type="number"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-900 border border-gray-200 dark:border-charcoal-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowItemModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-md"
                  >
                    Save Dish
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

export default RestaurantMenuPage;
