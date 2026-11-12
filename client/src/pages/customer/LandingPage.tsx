import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Clock,
  ShieldCheck,
  Zap,
  Users,
  Compass,
} from 'lucide-react';
import api from '../../services/api.ts';
import { Restaurant, FoodItem } from '../../types/index.ts';
import RestaurantCard from '../../components/customer/RestaurantCard.tsx';
import FoodCard from '../../components/customer/FoodCard.tsx';

export const LandingPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [trendingDishes, setTrendingDishes] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getRestaurants({ sortBy: 'popular' });
        if (res.success) {
          setRestaurants(res.restaurants || []);
        }
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Biryani', icon: '🍲', slug: 'Biryani & Bowls' },
    { name: 'Gourmet Pizzas', icon: '🍕', slug: 'Gourmet Pizzas' },
    { name: 'Artisan Burgers', icon: '🍔', slug: 'American Burgers' },
    { name: 'Pan-Asian Dimsums', icon: '🥟', slug: 'Pan-Asian & Dimsums' },
    { name: 'Mexican Tacos', icon: '🌮', slug: 'Tacos & Mexican' },
    { name: 'Superfood Salads', icon: '🥗', slug: 'Healthy & Green' },
    { name: 'Belgian Waffles', icon: '🍰', slug: 'Desserts & Bakes' },
    { name: 'Thick Shakes', icon: '🥤', slug: 'Drinks & Shakes' },
  ];

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 dark:bg-charcoal-800 border border-orange-200 dark:border-charcoal-700 text-primary text-xs font-bold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen AI Food Ecosystem</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 dark:text-white tracking-tight leading-[1.15]">
                Your Cravings. <br />
                <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Our Command.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover artisan cloud kitchens, wood-fired pizzerias, and royal dum biryanis. Powered by real-time order state machines and CraveBot AI recommendation.
              </p>

              {/* Big Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="max-w-xl mx-auto lg:mx-0 relative flex items-center bg-white dark:bg-charcoal-800 rounded-3xl p-2 border-2 border-orange-200 dark:border-charcoal-700 shadow-premium focus-within:border-primary transition-all"
              >
                <div className="pl-3 text-primary">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for biryani, sourdough pizza, burgers..."
                  className="w-full px-3 py-2 text-xs sm:text-sm text-charcoal-800 dark:text-gray-100 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  Find Food
                </button>
              </form>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-charcoal-500 dark:text-gray-400">
                <span className="font-semibold text-charcoal-700 dark:text-gray-300">Popular:</span>
                {['Burrata Pizza', 'Dum Biryani', 'Double Smash', 'Acai Bowl', 'Chai Flask'].map((term) => (
                  <button
                    key={term}
                    onClick={() => navigate(`/restaurants?search=${encodeURIComponent(term)}`)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 hover:border-primary text-charcoal-600 dark:text-gray-300 hover:text-primary transition-colors text-[11px]"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Ecosystem Stats Row */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-orange-100/60 dark:border-charcoal-800 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="font-display font-extrabold text-2xl text-primary">12+</p>
                  <p className="text-[11px] text-gray-500 font-medium">Curated Kitchens</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl text-charcoal-800 dark:text-white">25m</p>
                  <p className="text-[11px] text-gray-500 font-medium">Avg Delivery</p>
                </div>
                <div>
                  <p className="font-display font-extrabold text-2xl text-emerald-500">4.8★</p>
                  <p className="text-[11px] text-gray-500 font-medium">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-charcoal-700 bg-white dark:bg-charcoal-800 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80"
                    alt="Delicious Pizza and feast"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-display font-extrabold text-base text-charcoal-800 dark:text-white">
                        Wood-Fired Truffle Margherita
                      </h4>
                      <span className="text-primary font-black text-sm">₹380</span>
                    </div>
                    <p className="text-xs text-charcoal-500 dark:text-gray-400">
                      Gustoso Sourdough Pizza Co. • 25 mins
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1 - Live Tracking State */}
                <div className="absolute -top-5 -left-4 bg-white/95 dark:bg-charcoal-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-orange-200 dark:border-charcoal-600 shadow-xl flex items-center gap-3 animate-bounce-subtle">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                    <Zap className="w-4 h-4 fill-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">Real-Time State</p>
                    <p className="text-xs font-extrabold text-charcoal-800 dark:text-white">Baking in Oven • 12m away</p>
                  </div>
                </div>

                {/* Floating Badge 2 - Free Delivery */}
                <div className="absolute -bottom-5 -right-3 bg-gradient-to-r from-primary to-orange-500 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <div>
                    <p className="text-[10px] font-bold text-orange-100 uppercase">First Order Offer</p>
                    <p className="text-xs font-extrabold">50% OFF | Code: FIRST50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES CAROUSEL */}
      <section className="py-10 bg-white/70 dark:bg-charcoal-850/70 border-y border-orange-100 dark:border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white">
                Explore Delicious Cuisines
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-gray-400">
                From slow-dum biryanis to wood-fired Neapolitan crusts
              </p>
            </div>
            <Link
              to="/restaurants"
              className="text-xs font-bold text-primary hover:text-primary-600 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/restaurants?cuisine=${encodeURIComponent(cat.slug)}`)}
                className="group p-3 rounded-2xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 hover:border-primary/50 shadow-xs hover:shadow-soft flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-charcoal-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-2">
                  {cat.icon}
                </div>
                <span className="font-bold text-[11px] text-charcoal-800 dark:text-gray-200 group-hover:text-primary transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. UNIQUE FEATURES SHOWCASE: Mood, Wheel, Group Dine, Passport */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
              Food Ordering Re-imagined
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 dark:text-gray-400 mt-2">
              Beyond ordinary food apps. Discover gamified dining, shared group ordering, and mood-matched comfort meals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Mood Match */}
            <Link
              to="/mood"
              className="group p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 hover:border-primary shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  🎭
                </div>
                <h4 className="font-display font-bold text-base text-charcoal-800 dark:text-white group-hover:text-primary transition-colors">
                  Food Mood Selector
                </h4>
                <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Stressed, romantic, tired, or celebrating? Let your mood dictate your chef-crafted meal.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Select Mood</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature 2: Spin the Wheel */}
            <Link
              to="/spin-wheel"
              className="group p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 hover:border-primary shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  🎡
                </div>
                <h4 className="font-display font-bold text-base text-charcoal-800 dark:text-white group-hover:text-primary transition-colors">
                  Spin the Food Wheel
                </h4>
                <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Can't decide what to order? Filter by budget and spin for a delightful culinary surprise!
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Spin to Discover</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature 3: Group Dine */}
            <Link
              to="/group-order"
              className="group p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 hover:border-primary shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  👥
                </div>
                <h4 className="font-display font-bold text-base text-charcoal-800 dark:text-white group-hover:text-primary transition-colors">
                  Group Ordering Room
                </h4>
                <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Invite friends via a shared code. Everyone adds their own food into one synchronized cart.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>Create Room</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Feature 4: Food Passport */}
            <Link
              to="/passport"
              className="group p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 hover:border-primary shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  🏆
                </div>
                <h4 className="font-display font-bold text-base text-charcoal-800 dark:text-white group-hover:text-primary transition-colors">
                  Food Passport & Badges
                </h4>
                <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-2 leading-relaxed">
                  Earn CravePoints, unlock culinary badges, and complete foodie challenges for free discounts.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-charcoal-700 flex items-center gap-1.5 text-xs font-bold text-primary">
                <span>View Passport</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. POPULAR RESTAURANTS SECTION */}
      <section className="py-12 bg-white/50 dark:bg-charcoal-850/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary fill-primary" />
                <h3 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
                  Trending Restaurants
                </h3>
              </div>
              <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
                Highest rated gourmet kitchens near your location
              </p>
            </div>
            <Link
              to="/restaurants"
              className="px-4 py-2 rounded-xl bg-orange-100/70 dark:bg-charcoal-800 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors"
            >
              Explore All 12+ Spots
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.slice(0, 6).map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS & TRUST */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
              Loved by 50,000+ Foodies
            </h3>
            <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
              Here is what genuine gastronomes say about their CraveX deliveries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rohan Mehra',
                role: 'Tech Lead & Foodie',
                comment: 'The live state machine tracking and OTP verification are game changers. Pizza arrived steaming hot in 22 minutes!',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
                rating: 5,
              },
              {
                name: 'Ananya Deshmukh',
                role: 'Culinary Blogger',
                comment: 'CraveBot actually suggested an authentic Dum Biryani that fit my ₹300 budget perfectly. Super intelligent platform!',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
                rating: 5,
              },
              {
                name: 'Karan Verma',
                role: 'Design Director',
                comment: 'Group ordering during team hackathons solved so many headaches. Everyone added their meal and we tracked it together.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
                rating: 5,
              },
            ].map((testi, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(testi.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-charcoal-600 dark:text-gray-300 leading-relaxed italic">
                    "{testi.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-charcoal-700">
                  <img src={testi.avatar} alt={testi.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-charcoal-800 dark:text-white">{testi.name}</h5>
                    <p className="text-[10px] text-gray-400">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
