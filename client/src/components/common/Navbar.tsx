import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Bell,
  Sun,
  Moon,
  MapPin,
  Sparkles,
  Compass,
  Award,
  Users,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Bike,
  Store,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import { UserRole } from '../../types/index.ts';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalItemCount, total } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Indiranagar, Bengaluru');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const locationsList = [
    'Indiranagar, Bengaluru',
    'Koramangala 4th Block, Bengaluru',
    'Church Street, MG Road, Bengaluru',
    'HSR Layout Sector 1, Bengaluru',
    'Whitefield ITPL Road, Bengaluru',
  ];

  const handleRoleSwitch = async (role: UserRole) => {
    setShowDemoMenu(false);
    await demoLogin(role);
    if (role === 'customer') navigate('/restaurants');
    else if (role === 'restaurant') navigate('/restaurant/dashboard');
    else if (role === 'delivery') navigate('/delivery/dashboard');
    else if (role === 'admin') navigate('/admin/overview');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md border-b border-orange-100 dark:border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Location */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  CRAVE<span className="text-charcoal-800 dark:text-white">X</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-charcoal-400 dark:text-gray-400 -mt-1">
                  AI Food Ecosystem
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50/70 dark:bg-charcoal-800/70 border border-orange-200/60 dark:border-charcoal-700 hover:border-primary text-xs font-medium text-charcoal-700 dark:text-gray-200 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="max-w-[150px] truncate">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-orange-100 dark:border-charcoal-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <p className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-400 dark:text-gray-400">
                    Select Your Neighborhood
                  </p>
                  {locationsList.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-orange-50 dark:hover:bg-charcoal-700/60 transition-colors flex items-center justify-between ${
                        selectedLocation === loc ? 'text-primary font-semibold' : 'text-charcoal-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{loc}</span>
                      {selectedLocation === loc && <span className="text-primary text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/restaurants"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/restaurants'
                  ? 'bg-orange-100/70 dark:bg-charcoal-800 text-primary'
                  : 'text-charcoal-700 dark:text-gray-300 hover:text-primary hover:bg-orange-50/50 dark:hover:bg-charcoal-800/40'
              }`}
            >
              <Compass className="w-4 h-4 text-primary" />
              Restaurants
            </Link>

            <Link
              to="/mood"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/mood'
                  ? 'bg-orange-100/70 dark:bg-charcoal-800 text-primary'
                  : 'text-charcoal-700 dark:text-gray-300 hover:text-primary hover:bg-orange-50/50 dark:hover:bg-charcoal-800/40'
              }`}
            >
              <span className="text-sm">🎭</span>
              Mood Match
            </Link>

            <Link
              to="/spin-wheel"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/spin-wheel'
                  ? 'bg-orange-100/70 dark:bg-charcoal-800 text-primary'
                  : 'text-charcoal-700 dark:text-gray-300 hover:text-primary hover:bg-orange-50/50 dark:hover:bg-charcoal-800/40'
              }`}
            >
              <span className="text-sm">🎡</span>
              Food Wheel
            </Link>

            <Link
              to="/budget-mode"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/budget-mode'
                  ? 'bg-orange-100/70 dark:bg-charcoal-800 text-primary'
                  : 'text-charcoal-700 dark:text-gray-300 hover:text-primary hover:bg-orange-50/50 dark:hover:bg-charcoal-800/40'
              }`}
            >
              <Wallet className="w-4 h-4 text-emerald-500" />
              Budget Mode
            </Link>

            <Link
              to="/group-order"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/group-order')
                  ? 'bg-orange-100/70 dark:bg-charcoal-800 text-primary'
                  : 'text-charcoal-700 dark:text-gray-300 hover:text-primary hover:bg-orange-50/50 dark:hover:bg-charcoal-800/40'
              }`}
            >
              <Users className="w-4 h-4 text-purple-500" />
              Group Dine
            </Link>

            <Link
              to="/passport"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/passport'
                  ? 'bg-orange-100/70 dark:bg-charcoal-800 text-primary'
                  : 'text-charcoal-700 dark:text-gray-300 hover:text-primary hover:bg-orange-50/50 dark:hover:bg-charcoal-800/40'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              Food Passport
            </Link>
          </div>

          {/* Right Section: Actions & Profiles */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Dashboard Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-300/60 dark:border-orange-800/60 text-primary text-[11px] font-bold flex items-center gap-1.5 hover:from-orange-500/20 hover:to-amber-500/20 transition-all"
                title="Switch between the 4 dashboards"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                <span className="hidden sm:inline">Role:</span>
                <span className="uppercase">{user?.role || 'Demo'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-orange-100 dark:border-charcoal-700 p-2 z-50">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-charcoal-400 dark:text-gray-400">
                    Switch Active Interface
                  </p>
                  <button
                    onClick={() => handleRoleSwitch('customer')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-orange-50 dark:hover:bg-charcoal-700 font-medium text-charcoal-700 dark:text-gray-200"
                  >
                    <span className="text-base">🍔</span>
                    <span>1. Customer App</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('restaurant')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-orange-50 dark:hover:bg-charcoal-700 font-medium text-charcoal-700 dark:text-gray-200"
                  >
                    <Store className="w-4 h-4 text-orange-500" />
                    <span>2. Restaurant Owner</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('delivery')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-orange-50 dark:hover:bg-charcoal-700 font-medium text-charcoal-700 dark:text-gray-200"
                  >
                    <Bike className="w-4 h-4 text-emerald-500" />
                    <span>3. Delivery Partner</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-orange-50 dark:hover:bg-charcoal-700 font-medium text-charcoal-700 dark:text-gray-200"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-500" />
                    <span>4. Super Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-charcoal-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-charcoal-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-xl text-charcoal-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-charcoal-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-orange-100 dark:border-charcoal-700 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-charcoal-700">
                    <span className="font-bold text-xs text-charcoal-800 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-primary hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-gray-400 py-6">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 6).map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => {
                            markAsRead(notif._id);
                            if (notif.link) navigate(notif.link);
                            setShowNotifMenu(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                            notif.read
                              ? 'bg-gray-50/60 dark:bg-charcoal-750 opacity-70'
                              : 'bg-orange-50/70 dark:bg-charcoal-700 border-l-2 border-primary'
                          }`}
                        >
                          <p className="font-semibold text-charcoal-800 dark:text-gray-100">{notif.title}</p>
                          <p className="text-charcoal-500 dark:text-gray-300 text-[11px] mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-primary-600 transition-all shadow-md shadow-orange-500/20 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemCount > 0 && (
                <span className="bg-white text-primary text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {totalItemCount}
                </span>
              )}
              {total > 0 && <span className="hidden md:inline font-semibold">| ₹{total}</span>}
            </Link>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-orange-50/80 dark:bg-charcoal-800 border border-orange-200/50 dark:border-charcoal-700 hover:border-primary transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-xl object-cover"
                  />
                  <span className="text-xs font-semibold text-charcoal-700 dark:text-gray-200 max-w-[80px] truncate hidden sm:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 mr-1" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-charcoal-800 rounded-2xl shadow-premium border border-orange-100 dark:border-charcoal-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-charcoal-700">
                      <p className="font-bold text-xs text-charcoal-800 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{user?.role} Account</p>
                      {user?.loyaltyPoints !== undefined && (
                        <p className="text-[11px] font-semibold text-amber-500 mt-1 flex items-center gap-1">
                          🪙 {user.loyaltyPoints} CravePoints
                        </p>
                      )}
                    </div>

                    {user?.role === 'restaurant' && (
                      <Link
                        to="/restaurant/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-700"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                        Restaurant Dashboard
                      </Link>
                    )}

                    {user?.role === 'delivery' && (
                      <Link
                        to="/delivery/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-700"
                      >
                        <Bike className="w-3.5 h-3.5 text-emerald-500" />
                        Delivery Dashboard
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/overview"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-700"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-700"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-orange-500" />
                      My Orders
                    </Link>

                    <Link
                      to="/passport"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-700"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      Food Passport
                    </Link>

                    <Link
                      to="/rewards"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-700"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Rewards & Coupons
                    </Link>

                    <Link
                      to="/support"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-700"
                    >
                      <span>💬</span>
                      Help & Support
                    </Link>

                    <div className="pt-1 mt-1 border-t border-gray-100 dark:border-charcoal-700">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-charcoal-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-charcoal-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-600 shadow-md shadow-orange-500/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
