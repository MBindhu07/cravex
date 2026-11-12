import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import api from '../../services/api.ts';
import { FoodItem } from '../../types/index.ts';
import FoodCard from '../../components/customer/FoodCard.tsx';

const MOODS = [
  { id: 'Happy', emoji: '😄', label: 'Happy & Cheerful', desc: 'Cheesy pizzas, crispy burgers & party food' },
  { id: 'Sad', emoji: '🥺', label: 'Need Comfort', desc: 'Warm pasta, molten chocolate & sweet hugs' },
  { id: 'Stressed', emoji: '🤯', label: 'Stressed Out', desc: 'Bold, punchy spices & fiery noodles' },
  { id: 'Tired', emoji: '😴', label: 'Tired & Drained', desc: 'Quick nourishing rice bowls & superfoods' },
  { id: 'Celebrating', emoji: '🥳', label: 'Celebration Mode', desc: 'Royal platters, biryanis & grand feasts' },
  { id: 'Romantic', emoji: '🍷', label: 'Romantic Candlelight', desc: 'Artisanal Italian, sushi & fine desserts' },
  { id: 'Hungry', emoji: '🦁', label: 'Beast Appetite', desc: 'Triple patty stacks & monster portions' },
  { id: 'Adventure', emoji: '🌶️', label: 'Culinary Adventure', desc: 'Extra fiery curries & exotic flavors' },
];

export const MoodPage: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [dishes, setDishes] = useState<FoodItem[]>([]);
  const [tagline, setTagline] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMoodFood = async () => {
      setLoading(true);
      try {
        const res = await api.getFoodByMood(selectedMood);
        if (res.success) {
          setDishes(res.dishes || []);
          setTagline(res.tagline || '');
        }
      } catch (err) {
        console.error('Failed to load mood food:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoodFood();
  }, [selectedMood]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-300 text-xs font-bold mb-3 shadow-xs">
          <span>🎭</span>
          <span>Mood-Based Culinary Discovery</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900 dark:text-white">
          How Are You Feeling Right Now?
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-gray-400 mt-2">
          Select your current vibe and our culinary engine will curate the ultimate soul-soothing dishes for you.
        </p>
      </div>

      {/* Mood Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12">
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMood(m.id)}
              className={`p-4 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-gradient-to-br from-orange-50 to-amber-50 dark:from-charcoal-800 dark:to-charcoal-750 shadow-premium scale-[1.02]'
                  : 'bg-white dark:bg-charcoal-800 border-orange-100/70 dark:border-charcoal-700 hover:border-primary/40 shadow-soft'
              }`}
            >
              <div className="text-3xl mb-2">{m.emoji}</div>
              <div>
                <h4 className={`font-bold text-xs sm:text-sm ${isSelected ? 'text-primary' : 'text-charcoal-800 dark:text-white'}`}>
                  {m.label}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-charcoal-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {m.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recommended Dishes Banner */}
      <div className="bg-orange-50/70 dark:bg-charcoal-800/70 rounded-3xl p-6 border border-orange-200/60 dark:border-charcoal-700 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
            Curated For Your Mood
          </span>
          <h3 className="font-display font-bold text-base sm:text-lg text-charcoal-800 dark:text-white mt-0.5">
            {tagline}
          </h3>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-white dark:bg-charcoal-700 text-xs font-bold text-charcoal-700 dark:text-gray-200 shadow-xs self-start sm:self-auto">
          {dishes.length} Handpicked Delicacies
        </span>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodPage;
