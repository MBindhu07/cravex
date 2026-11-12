import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '../types/index.ts';
import api from '../services/api.ts';
import { getSocket } from '../services/socket.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cravex_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          // Join socket user room
          const socket = getSocket();
          socket.emit('join_user', res.user._id);
          if (res.user.role === 'restaurant' && res.user.restaurantId) {
            socket.emit('join_restaurant', res.user.restaurantId);
          } else if (res.user.role === 'delivery') {
            socket.emit('join_delivery', res.user._id);
          }
        }
      } catch (err) {
        console.warn('Failed to load user session:', err);
        localStorage.removeItem('cravex_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('cravex_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    if (res.success && res.token) {
      localStorage.setItem('cravex_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const demoLogin = async (role: UserRole) => {
    const res = await api.demoLogin(role);
    if (res.success && res.token) {
      localStorage.setItem('cravex_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('cravex_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
