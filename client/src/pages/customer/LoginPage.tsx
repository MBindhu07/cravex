import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, Store, Bike, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import { UserRole } from '../../types/index.ts';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);

    try {
      await login(email, password);
      addToast('Welcome Back! 🔥', 'Logged into CraveX successfully.', 'success');
      navigate('/restaurants');
    } catch (err: any) {
      addToast('Sign In Failed', err.message || 'Invalid email or password', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async (role: UserRole) => {
    setSubmitting(true);
    try {
      await demoLogin(role);
      addToast('Demo Signed In 🚀', `Active role switched to ${role.toUpperCase()}`, 'success');
      if (role === 'customer') navigate('/restaurants');
      else if (role === 'restaurant') navigate('/restaurant/dashboard');
      else if (role === 'delivery') navigate('/delivery/dashboard');
      else if (role === 'admin') navigate('/admin/overview');
    } catch (err: any) {
      addToast('Demo Login Failed', err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
      {/* Brand logo & header */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 group mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
            <span className="text-2xl">🔥</span>
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
            CRAVEX
          </span>
        </Link>
        <h1 className="font-display font-extrabold text-2xl text-charcoal-900 dark:text-white">
          Welcome to CraveX
        </h1>
        <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
          Sign in to access your culinary dashboard & orders
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-orange-100 dark:border-charcoal-700 shadow-premium">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@cravex.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-600 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-charcoal-500 dark:text-gray-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Sign up now
          </Link>
        </p>

        {/* 1-Click Fast Demo Login for Reviewers */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-charcoal-700">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400 dark:text-gray-400 text-center mb-3 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Instant 1-Click Demo Login</span>
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoSignIn('customer')}
              className="p-2.5 rounded-xl bg-orange-50 dark:bg-charcoal-700 border border-orange-200 dark:border-charcoal-600 hover:border-primary text-xs font-bold text-charcoal-800 dark:text-white flex items-center gap-2"
            >
              <span>🍔</span>
              <span>Customer Demo</span>
            </button>
            <button
              onClick={() => handleDemoSignIn('restaurant')}
              className="p-2.5 rounded-xl bg-orange-50 dark:bg-charcoal-700 border border-orange-200 dark:border-charcoal-600 hover:border-primary text-xs font-bold text-charcoal-800 dark:text-white flex items-center gap-2"
            >
              <Store className="w-3.5 h-3.5 text-orange-500" />
              <span>Owner Demo</span>
            </button>
            <button
              onClick={() => handleDemoSignIn('delivery')}
              className="p-2.5 rounded-xl bg-orange-50 dark:bg-charcoal-700 border border-orange-200 dark:border-charcoal-600 hover:border-primary text-xs font-bold text-charcoal-800 dark:text-white flex items-center gap-2"
            >
              <Bike className="w-3.5 h-3.5 text-emerald-500" />
              <span>Rider Demo</span>
            </button>
            <button
              onClick={() => handleDemoSignIn('admin')}
              className="p-2.5 rounded-xl bg-orange-50 dark:bg-charcoal-700 border border-orange-200 dark:border-charcoal-600 hover:border-primary text-xs font-bold text-charcoal-800 dark:text-white flex items-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
