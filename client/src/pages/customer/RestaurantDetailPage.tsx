import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Bike,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  CheckCircle2,
  Share2,
  Users,
} from 'lucide-react';
import api from '../../services/api.ts';
import { Restaurant, FoodItem, Review } from '../../types/index.ts';
import FoodCard from '../../components/customer/FoodCard.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [menuSearch, setMenuSearch] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews'>('menu');
  const [loading, setLoading] = useState<boolean>(true);

  const { items, restaurantId, totalItemCount, total } = useCart();
  const { addToast } = useNotifications();

  useEffect(() => {
    if (!id) return;
    const fetchRestaurantData = async () => {
      setLoading(true);
      try {
        const res = await api.getRestaurantById(id);
        if (res.success) {
          setRestaurant(res.restaurant);
          setMenuItems(res.menuItems || []);
          setReviews(res.reviews || []);
        }
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold">Restaurant not found</h2>
        <Link to="/restaurants" className="mt-4 inline-block text-primary font-semibold text-xs">
          ← Back to all restaurants
        </Link>
      </div>
    );
  }

  // Categories list extracted from menu
  const menuCategories = ['All', ...Array.from(new Set(menuItems.map((m) => m.category)))];

  // Filtered menu
  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !menuSearch.trim() ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Link Copied! 📋', 'Restaurant link copied to clipboard.', 'info');
  };

  const isCurrentCartFromThisRestaurant = restaurantId === restaurant._id && totalItemCount > 0;

  return (
    <div className="pb-24">
      {/* 1. RESTAURANT HERO COVER */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-charcoal-900">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />

        {/* Floating actions */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <Link
            to={`/group-order?restaurantId=${restaurant._id}`}
            className="px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-charcoal-800/90 backdrop-blur-md text-purple-600 text-xs font-bold hover:bg-white flex items-center gap-1.5 shadow-md"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Dine</span>
          </Link>
          <button
            onClick={handleShare}
            className="p-2 rounded-2xl bg-white/90 dark:bg-charcoal-800/90 backdrop-blur-md text-charcoal-700 dark:text-gray-200 hover:text-primary transition-colors shadow-md"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Restaurant Header Details */}
        <div className="absolute bottom-6 left-4 right-4 max-w-7xl mx-auto sm:px-4 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase tracking-wide">
                Premium Partner
              </span>
              {restaurant.isVegOnly && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                  🌱 100% Pure Veg
                </span>
              )}
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl">{restaurant.name}</h1>
            <p className="text-xs sm:text-sm text-gray-300">{restaurant.tagline || restaurant.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary" /> {restaurant.address}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {restaurant.contactPhone}</span>
            </div>
          </div>

          {/* Rating & Delivery Info Box */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start sm:self-auto shrink-0">
            <div className="text-center pr-3 border-r border-white/20">
              <div className="flex items-center justify-center gap-1 font-extrabold text-base text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-gray-300">{restaurant.reviewsCount}+ reviews</p>
            </div>
            <div className="text-center pr-3 border-r border-white/20">
              <p className="font-extrabold text-base text-white">{restaurant.deliveryEstimate}m</p>
              <p className="text-[10px] text-gray-300">Delivery Time</p>
            </div>
            <div className="text-center">
              <p className="font-extrabold text-base text-white">₹{restaurant.deliveryFee}</p>
              <p className="text-[10px] text-gray-300">Delivery Fee</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between border-b border-orange-100 dark:border-charcoal-800 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('menu')}
              className={`font-display font-bold text-sm pb-1 border-b-2 transition-all ${
                activeTab === 'menu'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-white'
              }`}
            >
              Interactive Menu ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`font-display font-bold text-sm pb-1 border-b-2 transition-all ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-white'
              }`}
            >
              Guest Reviews ({reviews.length})
            </button>
          </div>

          {/* Special Offers Tag */}
          {restaurant.specialOffers && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 dark:bg-charcoal-800 border border-orange-200 dark:border-charcoal-700 text-primary text-xs font-bold">
              <span>🎁</span>
              <span>{restaurant.specialOffers}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. MENU TAB CONTENT */}
      {activeTab === 'menu' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Menu Search and Veg Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search within this menu..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                  vegOnly
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-charcoal-800 border-gray-200 dark:border-charcoal-700 text-charcoal-700 dark:text-gray-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Veg Only</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-orange-500/20'
                    : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-gray-300 border border-orange-100 dark:border-charcoal-700 hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          {filteredMenu.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-charcoal-800 rounded-3xl border border-dashed border-gray-200 dark:border-charcoal-700">
              <p className="text-sm font-semibold text-gray-500">No dishes match your search.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMenuSearch('');
                  setVegOnly(false);
                }}
                className="mt-3 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Reset Menu Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((food) => (
                <FoodCard
                  key={food._id}
                  food={{
                    ...food,
                    restaurantName: restaurant.name,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. REVIEWS TAB CONTENT */}
      {activeTab === 'reviews' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-12">No reviews yet for this restaurant.</p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={rev.userName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-charcoal-800 dark:text-white flex items-center gap-1.5">
                          <span>{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </h5>
                        <p className="text-[10px] text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-emerald-600" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-600 dark:text-gray-300 leading-relaxed mt-2">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. STICKY BOTTOM CART FLOATING PILL */}
      {isCurrentCartFromThisRestaurant && (
        <div className="fixed bottom-6 inset-x-0 max-w-xl mx-auto px-4 z-40">
          <Link
            to="/cart"
            className="w-full p-4 rounded-3xl bg-primary text-white shadow-2xl flex items-center justify-between hover:bg-primary-600 transition-all transform hover:scale-[1.01] active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-extrabold text-sm">
                {totalItemCount}
              </div>
              <div>
                <p className="font-display font-extrabold text-sm">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} in Cart
                </p>
                <p className="text-[11px] text-orange-100">Click to review & checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg">₹{total}</span>
              <span className="text-xs">⟶</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
