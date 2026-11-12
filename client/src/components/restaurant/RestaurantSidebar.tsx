import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Boxes,
  Percent,
  Settings,
  BellRing,
  ArrowLeft,
} from 'lucide-react';

export const RestaurantSidebar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/restaurant/dashboard', label: 'Overview Analytics', icon: LayoutDashboard },
    { to: '/restaurant/live-orders', label: 'Live Kitchen Orders', icon: BellRing, badge: 'LIVE' },
    { to: '/restaurant/menu', label: 'Menu Management', icon: ChefHat },
    { to: '/restaurant/inventory', label: 'Inventory & Stock', icon: Boxes },
    { to: '/restaurant/promotions', label: 'Discounts & Offers', icon: Percent },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-charcoal-800 border-r border-orange-100 dark:border-charcoal-700 min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="px-3 py-2 mb-4 bg-orange-50 dark:bg-charcoal-750 rounded-2xl border border-orange-200/60 dark:border-charcoal-700">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kitchen Portal</p>
          <p className="font-display font-extrabold text-xs text-charcoal-800 dark:text-white truncate">
            Gustoso Sourdough Pizza Co.
          </p>
        </div>

        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-orange-500/20'
                    : 'text-charcoal-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-charcoal-700 hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? 'bg-white text-primary' : 'bg-red-500 text-white animate-pulse'}`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-charcoal-700">
        <Link
          to="/restaurants"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer App</span>
        </Link>
      </div>
    </aside>
  );
};

export default RestaurantSidebar;
