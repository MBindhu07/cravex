import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Zap, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-charcoal-900 border-t border-orange-100 dark:border-charcoal-800 pt-16 pb-12 transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-100 dark:border-charcoal-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                <span className="text-xl">🔥</span>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                CRAVE<span className="text-charcoal-800 dark:text-white">X</span>
              </span>
            </Link>
            <p className="text-sm text-charcoal-500 dark:text-gray-400 max-w-sm leading-relaxed">
              "Your Cravings. Our Command." Next-generation AI-powered food ordering and restaurant management ecosystem connecting foodies, master chefs, and delivery partners.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-charcoal-600 dark:text-gray-300 pt-2">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Hygiene</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Real-time State Machine</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-purple-500" /> AI Recommendations</span>
            </div>
          </div>

          {/* Customer Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-900 dark:text-white mb-4">
              Explore CraveX
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-600 dark:text-gray-400">
              <li><Link to="/restaurants" className="hover:text-primary transition-colors">Top Restaurants</Link></li>
              <li><Link to="/mood" className="hover:text-primary transition-colors">Food Mood Selector</Link></li>
              <li><Link to="/spin-wheel" className="hover:text-primary transition-colors">Spin the Food Wheel</Link></li>
              <li><Link to="/budget-mode" className="hover:text-primary transition-colors">Smart Budget Combos</Link></li>
              <li><Link to="/group-order" className="hover:text-primary transition-colors">Group Order Room</Link></li>
              <li><Link to="/passport" className="hover:text-primary transition-colors">Food Passport & Badges</Link></li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-900 dark:text-white mb-4">
              Unified Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-600 dark:text-gray-400">
              <li><Link to="/restaurant/dashboard" className="hover:text-primary transition-colors">Restaurant Owner Dashboard</Link></li>
              <li><Link to="/delivery/dashboard" className="hover:text-primary transition-colors">Delivery Partner Dashboard</Link></li>
              <li><Link to="/admin/overview" className="hover:text-primary transition-colors">Super Admin Dashboard</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">24/7 Customer Support</Link></li>
              <li><Link to="/rewards" className="hover:text-primary transition-colors">Loyalty Rewards Hub</Link></li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal-900 dark:text-white mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-600 dark:text-gray-400">
              <li>Bengaluru, Karnataka, India</li>
              <li>support@cravex.com</li>
              <li>+91 (080) 4900-CRAVE</li>
              <li className="pt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  ● Real-time Systems Active
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-400 dark:text-gray-500 gap-4">
          <p>© 2026 CraveX Inc. Built with React, Node, Socket.IO & MongoDB.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
