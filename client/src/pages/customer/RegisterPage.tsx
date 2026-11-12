import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'restaurant' | 'delivery'>('customer');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSubmitting(true);

    try {
      await register({ name, email, password, phone, role });
      addToast('Welcome to CraveX! 🎉', 'Your foodie account is ready with 100 CravePoints!', 'success');
      if (role === 'customer') navigate('/restaurants');
      else if (role === 'restaurant') navigate('/restaurant/dashboard');
      else if (role === 'delivery') navigate('/delivery/dashboard');
    } catch (err: any) {
      addToast('Registration Failed', err.message || 'Could not register account', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 min-h-screen flex flex-col justify-center">
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
          Join the CraveX Community
        </h1>
        <p className="text-xs text-charcoal-500 dark:text-gray-400 mt-1">
          Get 100 bonus CravePoints on signup + unlock food passport
        </p>
      </div>

      <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 sm:p-8 border border-orange-100 dark:border-charcoal-700 shadow-premium">
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 mb-1">
              Account Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'customer', label: 'Customer', icon: '🍔' },
                { id: 'restaurant', label: 'Restaurant', icon: '🏪' },
                { id: 'delivery', label: 'Delivery Rider', icon: '🛵' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    role === r.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-gray-50 dark:bg-charcoal-700 border-gray-200 dark:border-charcoal-600 text-charcoal-700 dark:text-gray-300'
                  }`}
                >
                  <span className="block text-base mb-0.5">{r.icon}</span>
                  <span className="text-[11px]">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

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
                placeholder="rohan@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 text-xs text-charcoal-800 dark:text-gray-100 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 dark:text-gray-300 mb-1">
              Create Password
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
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-charcoal-500 dark:text-gray-400 mt-4">
          Already registered?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
