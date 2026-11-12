import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Store,
  ShoppingCart,
  Tag,
  BarChart3,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/admin/overview', label: 'Platform Overview', icon: ShieldAlert },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/restaurants', label: 'Restaurant Approvals', icon: Store },
    { to: '/admin/orders', label: 'Order Monitoring', icon: ShoppingCart },
    { to: '/admin/coupons', label: 'Coupons & Promos', icon: Tag },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-charcoal-800 border-r border-orange-100 dark:border-charcoal-700 min-h-[calc(100vh-5rem)] p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="px-3 py-2 mb-4 bg-purple-50 dark:bg-purple-950/50 rounded-2xl border border-purple-200/60 dark:border-purple-800">
          <p className="text-[10px] font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider">
            Super Administrator
          </p>
          <p className="font-display font-extrabold text-xs text-charcoal-800 dark:text-white truncate">
            CraveX Master Control
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
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-charcoal-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-charcoal-700 hover:text-purple-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
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

export default AdminSidebar;
