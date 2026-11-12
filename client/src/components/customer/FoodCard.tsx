import React, { useState } from 'react';
import { Plus, Flame, Clock, Sparkles } from 'lucide-react';
import { FoodItem } from '../../types/index.ts';
import FoodCustomizationModal from './FoodCustomizationModal.tsx';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-4 border border-orange-100/70 dark:border-charcoal-700/80 hover:border-primary/40 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col justify-between group">
        <div>
          {/* Top image & badges */}
          <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-charcoal-700 mb-3.5">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Veg / Non-Veg Indicator */}
            <div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-charcoal-900/95 backdrop-blur-sm p-1 rounded-md shadow-sm">
              <span
                className={`w-3.5 h-3.5 border-2 flex items-center justify-center rounded-sm ${
                  food.isVeg ? 'border-emerald-600' : 'border-red-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    food.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                />
              </span>
            </div>

            {/* Bestseller Badge */}
            {food.isBestseller && (
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-primary text-white text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
                <Flame className="w-2.5 h-2.5 fill-white" /> Bestseller
              </span>
            )}

            {/* Prep Time Pill */}
            {food.preparationTime && (
              <span className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-primary" /> {food.preparationTime}m
              </span>
            )}
          </div>

          {/* Dish Details */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-display font-bold text-sm text-charcoal-800 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-1">
              {food.name}
            </h4>
            {food.spiceLevel && food.spiceLevel !== 'Mild' && (
              <span className="text-[10px] text-orange-500 font-bold shrink-0">
                🌶️ {food.spiceLevel}
              </span>
            )}
          </div>

          <p className="text-[11px] text-charcoal-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Pricing & Add Button */}
        <div className="pt-3 mt-3 border-t border-gray-100 dark:border-charcoal-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-charcoal-400 font-medium mr-0.5">₹</span>
            <span className="font-display font-extrabold text-base text-charcoal-900 dark:text-white">
              {food.price}
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-orange-50 dark:bg-charcoal-700 border border-orange-200 dark:border-charcoal-600 hover:bg-primary hover:text-white hover:border-primary text-primary font-bold text-xs flex items-center gap-1 transition-all duration-200 shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD</span>
          </button>
        </div>
      </div>

      <FoodCustomizationModal
        food={food}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FoodCard;
