import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, Flame, Sparkles } from 'lucide-react';
import { Restaurant } from '../../types/index.ts';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="group bg-white dark:bg-charcoal-800 rounded-3xl overflow-hidden border border-orange-100/80 dark:border-charcoal-700 hover:border-primary/50 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-charcoal-700">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {restaurant.bestsellerBadge && (
            <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3 fill-white" /> Bestseller
            </span>
          )}
          {restaurant.popularBadge && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-white" /> Top Rated
            </span>
          )}
          {restaurant.isVegOnly && (
            <span className="px-2 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md">
              🌱 Pure Veg
            </span>
          )}
        </div>

        {/* Special Offers Banner */}
        {restaurant.specialOffers && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-orange-200/50 dark:border-charcoal-700 text-[11px] font-bold text-primary truncate flex items-center gap-1.5">
            <span>🎁</span>
            <span className="truncate">{restaurant.specialOffers}</span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-bold text-base text-charcoal-800 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs shrink-0">
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Cuisine Tags */}
          <p className="text-xs text-charcoal-500 dark:text-gray-400 mb-2 line-clamp-1">
            {restaurant.cuisineTypes.join(' • ')}
          </p>

          {/* Matched Dishes on Search */}
          {(restaurant as any).matchedDishes && (restaurant as any).matchedDishes.length > 0 && (
            <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/40">
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block mb-0.5">
                Matched Menu Items:
              </span>
              <div className="flex flex-wrap gap-1">
                {(restaurant as any).matchedDishes.map((dish: any) => (
                  <span
                    key={dish._id}
                    className="text-[11px] font-medium text-charcoal-800 dark:text-gray-200 bg-white dark:bg-charcoal-800 px-2 py-0.5 rounded-md border border-orange-100 dark:border-charcoal-700"
                  >
                    🍴 {dish.name} <strong className="text-primary font-bold">₹{dish.price}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metrics Row */}
        <div className="pt-3 border-t border-gray-100 dark:border-charcoal-700/60 flex items-center justify-between text-xs font-medium text-charcoal-600 dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{restaurant.deliveryEstimate} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bike className="w-3.5 h-3.5 text-charcoal-400" />
            <span>{restaurant.deliveryFee === 0 ? 'FREE' : `₹${restaurant.deliveryFee}`}</span>
          </div>
          <div className="text-[11px] text-charcoal-400 dark:text-gray-400">
            Min ₹{restaurant.minOrder}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
