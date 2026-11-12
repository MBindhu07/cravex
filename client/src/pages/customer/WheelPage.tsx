import React, { useState } from 'react';
import { Sparkles, RotateCw, Check, ArrowRight } from 'lucide-react';
import api from '../../services/api.ts';
import { FoodItem } from '../../types/index.ts';
import { triggerPartyConfetti } from '../../components/common/ConfettiCelebration.tsx';
import FoodCustomizationModal from '../../components/customer/FoodCustomizationModal.tsx';

const WHEEL_COLORS = [
  '#FF6B35',
  '#FFAA8C',
  '#28A745',
  '#FFD166',
  '#845EC2',
  '#1E88E5',
  '#E6531D',
  '#202124',
];

export const WheelPage: React.FC = () => {
  const [vegOnly, setVegOnly] = useState(false);
  const [maxBudget, setMaxBudget] = useState(400);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<any | null>(null);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);

  // Default segments
  const [segments, setSegments] = useState<string[]>([
    'Truffle Margherita Pizza',
    'Royal Murgh Dum Biryani',
    'Double Smashed Burger',
    'Avocado Green Goddess Bowl',
    'Spicy Baja Fish Tacos',
    'Belgian Chocolate Waffle',
    'Tokyo Shoyu Ramen',
    'Bukhara Dal Makhani',
  ]);

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    try {
      const res = await api.spinTheWheel({ vegOnly, maxBudget });
      if (res.success && res.wheelSegments) {
        setSegments(res.wheelSegments.map((s: any) => s.name));

        const segmentAngle = 360 / res.wheelSegments.length;
        const targetIndex = res.winningIndex || 0;
        // Total rotations: 5 full spins (1800 deg) + angle to target
        const extraRotations = 1800 + (360 - targetIndex * segmentAngle - segmentAngle / 2);
        const finalRotation = rotation + extraRotations;

        setRotation(finalRotation);

        setTimeout(() => {
          setIsSpinning(false);
          setWinner(res.winner);
          triggerPartyConfetti();
        }, 4000);
      }
    } catch (err) {
      setIsSpinning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen text-center">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-xs font-bold mb-3 shadow-xs">
          <span>🎡</span>
          <span>Culinary Wheel of Fortune</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900 dark:text-white">
          Spin & Surprise Me!
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-500 dark:text-gray-400 mt-2">
          Can't decide what to eat? Let serendipity take over. Filter by your budget and let the wheel choose your delicious fate!
        </p>
      </div>

      {/* Filters Bar */}
      <div className="max-w-md mx-auto bg-white dark:bg-charcoal-800 p-4 rounded-3xl border border-orange-100 dark:border-charcoal-700 shadow-soft mb-8 flex items-center justify-between gap-4">
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
            vegOnly
              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300'
              : 'bg-gray-50 dark:bg-charcoal-700 border-gray-200 dark:border-charcoal-600 text-charcoal-700 dark:text-gray-300'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Veg Only</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-medium">Budget:</span>
          <select
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="px-2.5 py-1 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 font-bold text-charcoal-800 dark:text-gray-200 focus:outline-none"
          >
            <option value={200}>Under ₹200</option>
            <option value={300}>Under ₹300</option>
            <option value={450}>Under ₹450</option>
            <option value={1000}>No Limit</option>
          </select>
        </div>
      </div>

      {/* Wheel Visual Canvas */}
      <div className="relative w-72 sm:w-88 h-72 sm:h-88 mx-auto mb-8 flex items-center justify-center">
        {/* Top Pointer Needle */}
        <div className="absolute -top-3 z-30 transform -translate-x-1/2 left-1/2">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-primary filter drop-shadow-md" />
        </div>

        {/* Outer Wheel Rim */}
        <div
          className="w-full h-full rounded-full border-8 border-white dark:border-charcoal-700 shadow-2xl relative overflow-hidden transition-transform ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '4000ms' : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.2, 1)',
          }}
        >
          {segments.map((seg, i) => {
            const angle = 360 / segments.length;
            const rotate = i * angle;
            const bg = WHEEL_COLORS[i % WHEEL_COLORS.length];
            return (
              <div
                key={i}
                className="absolute inset-0 origin-center flex items-start justify-center pt-3 text-[10px] font-extrabold text-white text-center leading-tight shadow-inner"
                style={{
                  transform: `rotate(${rotate}deg)`,
                  clipPath: 'polygon(50% 50%, 20% 0, 80% 0)',
                  backgroundColor: bg,
                }}
              >
                <span className="transform rotate-90 translate-y-6 block max-w-[80px] truncate">
                  {seg}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="absolute z-20 w-18 h-18 rounded-full bg-white dark:bg-charcoal-800 border-4 border-primary shadow-glow flex flex-col items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-80 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-primary animate-spin-slow" />
          <span className="font-display font-extrabold text-[11px] text-charcoal-800 dark:text-white uppercase">
            {isSpinning ? 'Spinning' : 'Spin!'}
          </span>
        </button>
      </div>

      {/* Winner Display Card */}
      {winner && (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-charcoal-800 dark:to-charcoal-750 border-2 border-primary shadow-2xl animate-in zoom-in-95 text-left mb-12">
          <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider">
            🎉 Culinary Destiny Pick
          </span>
          <div className="flex items-center gap-4 mt-4">
            <img src={winner.image} alt={winner.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
            <div>
              <h3 className="font-display font-extrabold text-base text-charcoal-900 dark:text-white">
                {winner.name}
              </h3>
              <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-0.5">
                From {winner.restaurantName}
              </p>
              <p className="text-sm font-black text-primary mt-1">₹{winner.price}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFoodForModal(winner)}
            className="w-full mt-4 py-3 rounded-2xl bg-primary hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Customize & Order This Pick</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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

export default WheelPage;
