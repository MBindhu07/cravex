import React, { useState, useEffect } from 'react';
import { Store, Star, CheckCircle2, XCircle, AlertCircle, Phone, MapPin } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import api from '../../services/api.ts';
import { Restaurant } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const AdminRestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();

  const fetchRestaurants = async () => {
    try {
      const res = await api.getAllRestaurantsAdmin();
      if (res.success) {
        setRestaurants(res.restaurants || []);
      }
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleUpdateApproval = async (id: string, status: string, name: string) => {
    try {
      const res = await api.updateRestaurantApproval(id, status);
      if (res.success) {
        setRestaurants((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: status as any } : r))
        );
        addToast('Restaurant Status Updated', `${name} status is now ${status.toUpperCase()}`, 'info');
      }
    } catch (err: any) {
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
            Restaurant Verification & Approvals ({restaurants.length})
          </h1>
          <p className="text-xs text-charcoal-500 dark:text-gray-400">
            Audit cloud kitchen applications, inspect hygiene parameters, and toggle platform visibility
          </p>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-purple-100 dark:border-charcoal-700 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-3 bg-gray-100 dark:bg-charcoal-700">
                  <img
                    src={restaurant.coverImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      restaurant.status === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : restaurant.status === 'pending'
                        ? 'bg-amber-500 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {restaurant.status}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-sm text-charcoal-900 dark:text-white">
                    {restaurant.name}
                  </h4>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{restaurant.rating.toFixed(1)}</span>
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 line-clamp-1">{restaurant.cuisineTypes.join(' • ')}</p>
                <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">{restaurant.address}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-charcoal-700 flex items-center gap-2">
                {restaurant.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateApproval(restaurant._id, 'approved', restaurant.name)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    Approve
                  </button>
                )}
                {restaurant.status !== 'suspended' && (
                  <button
                    onClick={() => handleUpdateApproval(restaurant._id, 'suspended', restaurant.name)}
                    className="flex-1 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminRestaurantsPage;
