import React, { useState, useEffect } from 'react';
import { Award, Compass, Sparkles, CheckCircle2, Flame, Trophy } from 'lucide-react';
import api from '../../services/api.ts';
import { FoodPassport } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const FoodPassportPage: React.FC = () => {
  const [passport, setPassport] = useState<FoodPassport | null>(null);
  const [availableBadges, setAvailableBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();

  useEffect(() => {
    const fetchPassport = async () => {
      try {
        const res = await api.getFoodPassport();
        if (res.success) {
          setPassport(res.passport);
          setAvailableBadges(res.availableBadges || []);
        }
      } catch (err) {
        console.error('Failed to load food passport:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="h-64 rounded-3xl bg-gray-200 dark:bg-charcoal-800 animate-pulse mb-6" />
      </div>
    );
  }

  const unlockedBadgeIds = (passport?.badges || []).map((b) => b.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-primary rounded-3xl p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Gourmet Explorer Program</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl">
            My Food Passport
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-2 max-w-lg">
            Track your culinary exploration across Bengaluru. Every new cuisine earns you points, badges, and VIP dining perks.
          </p>
        </div>

        {/* CravePoints Box */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center shrink-0">
          <p className="text-xs uppercase font-extrabold tracking-wider text-orange-100">
            CravePoints Balance
          </p>
          <p className="font-display font-extrabold text-4xl text-amber-200 mt-1">
            {passport?.points || 0}
          </p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-white text-primary text-[10px] font-extrabold shadow-sm">
            Silver Gourmet Status
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Badges Collection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Culinary Badges Collection</span>
              <span className="text-xs text-primary font-extrabold">
                {unlockedBadgeIds.length} / {availableBadges.length} Unlocked
              </span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {availableBadges.map((badge) => {
                const isUnlocked = unlockedBadgeIds.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/60 dark:bg-charcoal-750 border-amber-300 dark:border-amber-800 shadow-sm'
                        : 'bg-gray-50/70 dark:bg-charcoal-750 opacity-40 grayscale border-gray-200 dark:border-charcoal-700'
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h5 className="font-bold text-xs text-charcoal-800 dark:text-white line-clamp-1">
                      {badge.name}
                    </h5>
                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                      {badge.description}
                    </p>
                    {isUnlocked && (
                      <span className="inline-block mt-2 text-[9px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        ✓ Unlocked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cuisines Explored */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-3">
              Cuisines Explored
            </h3>
            <div className="flex flex-wrap gap-2">
              {(passport?.cuisinesExplored || ['North Indian', 'Italian', 'Asian']).map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 rounded-full bg-orange-50 dark:bg-charcoal-700 text-primary font-bold text-xs border border-orange-200/60 dark:border-charcoal-600 shadow-xs flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-primary" />
                  <span>{c}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Challenges */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <span>Active Foodie Challenges</span>
            </h3>

            <div className="space-y-4">
              {(passport?.challenges || []).map((ch) => {
                const percent = Math.min(100, Math.round((ch.current / ch.target) * 100));
                return (
                  <div
                    key={ch.id}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-charcoal-750 border border-gray-100 dark:border-charcoal-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-xs text-charcoal-800 dark:text-white">{ch.title}</h5>
                      <span className="text-xs font-black text-amber-500">+{ch.rewardPoints} Pts</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-charcoal-600 overflow-hidden my-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Progress: {ch.current} / {ch.target}</span>
                      {ch.completed ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Completed!
                        </span>
                      ) : (
                        <span>{percent}% done</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPassportPage;
