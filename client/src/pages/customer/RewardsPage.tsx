import React, { useState } from 'react';
import { Sparkles, Tag, Gift, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import api from '../../services/api.ts';

export const RewardsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useNotifications();

  const [redeeming, setRedeeming] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const availableVouchers = [
    { pointsCost: 150, discount: 50, title: '₹50 Flat Discount Voucher', desc: 'Valid on orders above ₹199' },
    { pointsCost: 280, discount: 100, title: '₹100 Flat Discount Voucher', desc: 'Valid on orders above ₹399' },
    { pointsCost: 500, discount: 200, title: '₹200 Gourmet Feast Voucher', desc: 'Valid on orders above ₹699' },
  ];

  const couponsList = [
    { code: 'FIRST50', discount: '50% OFF', desc: 'For first order on CraveX up to ₹150', min: '₹199' },
    { code: 'CRAVEFEST', discount: '20% OFF', desc: 'Weekend feast discount up to ₹100', min: '₹299' },
    { code: 'HUNGRY20', discount: '20% OFF', desc: 'Quick bite discount up to ₹80', min: '₹250' },
    { code: 'FLAT100', discount: '₹100 FLAT', desc: 'Party order discount on orders > ₹499', min: '₹499' },
  ];

  const handleRedeem = async (pointsCost: number, discountAmount: number) => {
    if (!user || (user.loyaltyPoints || 0) < pointsCost) {
      addToast('Insufficient Points 🪙', `You need ${pointsCost} CravePoints to redeem this voucher.`, 'warning');
      return;
    }

    setRedeeming(true);
    try {
      const res = await api.redeemReward(pointsCost, discountAmount);
      if (res.success) {
        if (user) {
          updateUser({ ...user, loyaltyPoints: res.remainingPoints });
        }
        addToast('Voucher Unlocked! 🎁', `Code: ${res.code} added to your account!`, 'success');
      }
    } catch (err: any) {
      addToast('Redemption Error', err.message || 'Could not redeem', 'error');
    } finally {
      setRedeeming(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast('Code Copied! 📋', `${code} copied to clipboard.`, 'info');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 rounded-3xl p-8 text-white shadow-xl mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Loyalty & Perks Hub</span>
          </span>
          <h1 className="font-display font-extrabold text-3xl">Rewards & Coupons</h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-md">
            Earn 1 CravePoint for every ₹10 spent. Redeem points for discount vouchers on your next feast.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center shrink-0">
          <p className="text-xs uppercase font-extrabold text-orange-100">Your CravePoints</p>
          <p className="font-display font-extrabold text-4xl text-amber-200 mt-1">
            {user?.loyaltyPoints || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Redeem Points */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-base text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              <span>Redeem CravePoints for Vouchers</span>
            </h3>

            <div className="space-y-4">
              {availableVouchers.map((v, i) => {
                const canAfford = (user?.loyaltyPoints || 0) >= v.pointsCost;
                return (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-gray-50 dark:bg-charcoal-750 border border-gray-100 dark:border-charcoal-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-charcoal-800 dark:text-white">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{v.desc}</p>
                      <span className="inline-block mt-2 font-extrabold text-xs text-amber-500">
                        Cost: {v.pointsCost} CravePoints
                      </span>
                    </div>

                    <button
                      onClick={() => handleRedeem(v.pointsCost, v.discount)}
                      disabled={!canAfford || redeeming}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        canAfford
                          ? 'bg-primary text-white hover:bg-primary-600 shadow-sm active:scale-95'
                          : 'bg-gray-200 dark:bg-charcoal-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem Voucher' : 'Need More Points'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Active Platform Coupons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
            <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <span>Active Platform Coupons</span>
            </h3>

            <div className="space-y-3">
              {couponsList.map((coup) => (
                <div
                  key={coup.code}
                  className="p-4 rounded-2xl border-2 border-dashed border-orange-200 dark:border-charcoal-600 bg-orange-50/50 dark:bg-charcoal-750 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-primary tracking-wider">
                        {coup.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded-md">
                        {coup.discount}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">{coup.desc}</p>
                    <p className="text-[10px] text-gray-400">Min. Order: {coup.min}</p>
                  </div>

                  <button
                    onClick={() => copyToClipboard(coup.code)}
                    className="p-2 rounded-xl bg-white dark:bg-charcoal-700 border border-orange-200 dark:border-charcoal-600 text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    {copiedCode === coup.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
