import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Sparkles, Check } from 'lucide-react';
import api from '../../services/api.ts';
import { Restaurant } from '../../types/index.ts';
import RestaurantCard from '../../components/customer/RestaurantCard.tsx';

export const RestaurantListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || 'All');
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  const cuisinesList = [
    'All',
    'Italian',
    'Indian',
    'Gourmet Pizzas',
    'Biryani & Bowls',
    'American Burgers',
    'Pan-Asian & Dimsums',
    'Healthy & Green',
    'Tacos & Mexican',
    'Desserts & Bakes',
  ];

  const fetchRestaurants = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const params: any = { sortBy };
      if (search.trim()) params.search = search.trim();
      if (selectedCuisine && selectedCuisine !== 'All') params.cuisine = selectedCuisine;
      if (vegOnly) params.vegOnly = true;
      if (minRating) params.minRating = minRating;
      if (maxDeliveryTime) params.maxDeliveryTime = maxDeliveryTime;

      const res = await api.getRestaurants(params);
      if (res && res.success) {
        setRestaurants(res.restaurants || []);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRestaurants();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCuisine, vegOnly, minRating, maxDeliveryTime, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header & Search Bar */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
            Discover Gourmet Spots Near You
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-gray-400 mt-1">
            Handcrafted menus from verified premium cloud kitchens & restaurants
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant name, cuisine or dish..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-charcoal-800 border border-orange-200 dark:border-charcoal-700 text-xs sm:text-sm text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary-600 transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Cuisine Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {cuisinesList.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCuisine(c)}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedCuisine === c
                ? 'bg-primary text-white shadow-md shadow-orange-500/25'
                : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-gray-300 border border-orange-100 dark:border-charcoal-700 hover:border-primary/50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Advanced Quick Filters Bar */}
      <div className="bg-white dark:bg-charcoal-800 rounded-2xl p-4 border border-orange-100 dark:border-charcoal-700 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              vegOnly
                ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                : 'bg-gray-50 dark:bg-charcoal-700 border-gray-200 dark:border-charcoal-600 text-charcoal-700 dark:text-gray-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Pure Veg Only</span>
            {vegOnly && <Check className="w-3.5 h-3.5" />}
          </button>

          {/* 4.5+ Rating Filter */}
          <button
            onClick={() => setMinRating(minRating === 4.5 ? null : 4.5)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              minRating === 4.5
                ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-500 text-amber-700 dark:text-amber-300'
                : 'bg-gray-50 dark:bg-charcoal-700 border-gray-200 dark:border-charcoal-600 text-charcoal-700 dark:text-gray-300'
            }`}
          >
            ⭐ 4.5+ Rating
          </button>

          {/* Fast Delivery (< 30 min) */}
          <button
            onClick={() => setMaxDeliveryTime(maxDeliveryTime === 30 ? null : 30)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              maxDeliveryTime === 30
                ? 'bg-orange-50 dark:bg-orange-950/70 border-primary text-primary'
                : 'bg-gray-50 dark:bg-charcoal-700 border-gray-200 dark:border-charcoal-600 text-charcoal-700 dark:text-gray-300'
            }`}
          >
            ⚡ Under 30 mins
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-charcoal-800 dark:text-gray-200 font-bold focus:outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="fastest">Fastest Delivery</option>
            <option value="deliveryFee">Lowest Delivery Fee</option>
            <option value="minOrder">Minimum Order Amount</option>
          </select>
        </div>
      </div>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-72 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse" />
          ))}
        </div>
      ) : fetchError ? (
        <div className="text-center py-16 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-200 dark:border-red-800/40 p-8">
          <span className="text-4xl">🔌</span>
          <h3 className="font-bold text-lg text-charcoal-800 dark:text-white mt-3">
            Unable to connect to CraveX Backend
          </h3>
          <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            Please make sure the backend server is running on <code className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-charcoal-700 text-primary font-mono font-bold">http://localhost:5001</code>.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={fetchRestaurants}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-600 shadow-md transition-all"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-charcoal-800 rounded-3xl border border-dashed border-gray-200 dark:border-charcoal-700">
          <span className="text-4xl">🍽️</span>
          <h3 className="font-bold text-base text-charcoal-800 dark:text-white mt-3">
            No restaurants matched your filters
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see more kitchens.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCuisine('All');
              setVegOnly(false);
              setMinRating(null);
              setMaxDeliveryTime(null);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantListingPage;
