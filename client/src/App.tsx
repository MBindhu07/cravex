import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';

// Common Components
import Navbar from './components/common/Navbar.tsx';
import Footer from './components/common/Footer.tsx';
import FloatingFoodBackground from './components/common/FloatingFoodBackground.tsx';
import CraveBotModal from './components/customer/CraveBotModal.tsx';

// Customer Pages
import LandingPage from './pages/customer/LandingPage.tsx';
import RestaurantListingPage from './pages/customer/RestaurantListingPage.tsx';
import RestaurantDetailPage from './pages/customer/RestaurantDetailPage.tsx';
import CartPage from './pages/customer/CartPage.tsx';
import CheckoutPage from './pages/customer/CheckoutPage.tsx';
import OrderTrackingPage from './pages/customer/OrderTrackingPage.tsx';
import OrderHistoryPage from './pages/customer/OrderHistoryPage.tsx';
import MoodPage from './pages/customer/MoodPage.tsx';
import WheelPage from './pages/customer/WheelPage.tsx';
import BudgetPage from './pages/customer/BudgetPage.tsx';
import GroupOrderingPage from './pages/customer/GroupOrderingPage.tsx';
import FoodPassportPage from './pages/customer/FoodPassportPage.tsx';
import RewardsPage from './pages/customer/RewardsPage.tsx';
import SupportPage from './pages/customer/SupportPage.tsx';
import LoginPage from './pages/customer/LoginPage.tsx';
import RegisterPage from './pages/customer/RegisterPage.tsx';

// Restaurant Owner Pages
import RestaurantDashboardPage from './pages/restaurant/RestaurantDashboardPage.tsx';
import RestaurantLiveOrdersPage from './pages/restaurant/RestaurantLiveOrdersPage.tsx';
import RestaurantMenuPage from './pages/restaurant/RestaurantMenuPage.tsx';
import RestaurantInventoryPage from './pages/restaurant/RestaurantInventoryPage.tsx';
import RestaurantPromotionsPage from './pages/restaurant/RestaurantPromotionsPage.tsx';

// Delivery Partner Pages
import DeliveryDashboardPage from './pages/delivery/DeliveryDashboardPage.tsx';

// Super Admin Pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage.tsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.tsx';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage.tsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.tsx';
import AdminCouponsPage from './pages/admin/AdminCouponsPage.tsx';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboardView =
    location.pathname.startsWith('/restaurant/') ||
    location.pathname.startsWith('/delivery/') ||
    location.pathname.startsWith('/admin/');

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-primary selection:text-white">
      <FloatingFoodBackground />
      <Navbar />

      <div className="flex-grow relative z-10">
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/restaurants" element={<RestaurantListingPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-tracking/:id" element={<OrderTrackingPage />} />
          <Route path="/my-orders" element={<OrderHistoryPage />} />
          <Route path="/mood" element={<MoodPage />} />
          <Route path="/spin-wheel" element={<WheelPage />} />
          <Route path="/budget-mode" element={<BudgetPage />} />
          <Route path="/group-order" element={<GroupOrderingPage />} />
          <Route path="/passport" element={<FoodPassportPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Restaurant Owner Dashboard */}
          <Route path="/restaurant/dashboard" element={<RestaurantDashboardPage />} />
          <Route path="/restaurant/live-orders" element={<RestaurantLiveOrdersPage />} />
          <Route path="/restaurant/menu" element={<RestaurantMenuPage />} />
          <Route path="/restaurant/inventory" element={<RestaurantInventoryPage />} />
          <Route path="/restaurant/promotions" element={<RestaurantPromotionsPage />} />

          {/* Delivery Partner Dashboard */}
          <Route path="/delivery/dashboard" element={<DeliveryDashboardPage />} />

          {/* Super Admin Dashboard */}
          <Route path="/admin/overview" element={<AdminOverviewPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/coupons" element={<AdminCouponsPage />} />

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>

      {/* Floating AI CraveBot on non-dashboard views */}
      {!isDashboardView && <CraveBotModal />}

      {/* Footer on non-dashboard views */}
      {!isDashboardView && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Router>
              <AppContent />
            </Router>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
