# 🍔 CraveX – Next-Generation AI Food Ordering & Restaurant Management Ecosystem

> **"Your Cravings. Our Command."**  
> A production-grade, AI-powered food delivery and restaurant management ecosystem connecting Customers, Restaurant Owners, Delivery Partners, and Platform Administrators through one intelligent, real-time platform.

---

## 🌟 Architecture & Key Features

CraveX is designed as a unified full-stack ecosystem with **four distinct role-based interfaces** powered by a single reactive Node.js + Socket.IO backend and persistent database:

### 1. 🍽️ Customer Application
- **Animated Hero & Discovery**: Modern aesthetic with food photography, floating animated background, and fast location selector.
- **Smart Search & Filters**: Search dishes, cuisines, ingredients, and diet flags (*Pure Veg, Vegan, Gluten-Free, Jain-Friendly, Spicy*).
- **Interactive Menu Customization**: Dynamically select portion sizes, spice levels, gourmet add-ons, and special instructions with live price recalculation.
- **AI Concierge ("CraveBot")**: Conversational AI assistant providing budget-aware, diet-specific, and group dining recommendations with in-chat one-click ordering.
- **Real-Time Order State Machine**: Animated vertical progress timeline tracking all 8 states from order placement to doorstep handover, with simulated GPS map routes.
- **4-Digit Delivery OTP**: Security verification preventing premature delivery marking.
- **Unique Gamification**:
  - 🎭 **Food Mood Selector**: Order meals matched to your emotions (*Happy, Sad, Stressed, Romantic, Hungry, etc.*).
  - 🎡 **Spin the Food Wheel**: Physics-based surprise wheel filtered by budget and dietary preferences.
  - 💰 **Smart Budget Mode**: Define your exact cap (e.g., *"I have ₹300 for dinner"*) to calculate combos including taxes and delivery fee.
  - 👥 **Group Dine Room**: Synchronized squad cart with shareable 6-digit room code, countdown timer, and host cart locking.
  - 🏆 **Food Passport & CravePoints**: Earn points, explore cuisines, and unlock badges (*Biryani Explorer, Pizza Lover, Dessert Addict*).
  - 🎁 **Loyalty Rewards**: Redeem CravePoints for instant checkout discount coupons.

### 2. 🏪 Restaurant Owner Dashboard
- **Kitchen KPI Metrics**: Live orders count, revenue charts (Recharts), and best-selling signature dishes.
- **Live Order Management**: Real-time incoming order queue with audio chime, status transition actions (*Accept, Reject with reason, Start Cooking, Food Ready, Handover to Partner*).
- **Menu Management**: Add, edit, delete dishes, upload imagery, configure portion sizes, spice levels, and toggle availability.
- **Smart Inventory Tracking**: Raw material stock tracking (*kg/liters*), low-stock warnings, and automatic menu item disabling when ingredients deplete to 0.
- **Promotions Engine**: Launch restaurant coupons and percentage discount campaigns.

### 3. 🛵 Delivery Partner Dashboard
- **Availability Toggle**: Online / Offline switch for accepting dispatches.
- **Step-by-Step Delivery Lifecycle**:
  1. *Assignment Received* ⟶ *Accepted*
  2. *Reached Kitchen* ⟶ *Order Picked Up*
  3. *Out for Delivery* ⟶ *Reached Customer*
  4. *Enter Customer's 4-digit OTP* ⟶ *Order Delivered!*
- **GPS Simulation**: Broadcast real-time location coordinates to customer's live tracking map.
- **Earnings Tracker**: Daily and weekly payouts (₹65/order payout), completed delivery stats, and customer ratings.

### 4. 🛡️ Super Admin Master Dashboard
- **Platform Overview**: Gross GMV, 15% platform commission intake, total merchants, active users, and monthly growth velocity charts.
- **User Directory**: View customers, restaurant owners, and delivery riders; activate/deactivate account access.
- **Restaurant Approvals**: Verify merchant onboarding applications, review hygiene standards, approve, reject, or suspend kitchens.
- **Order Monitoring**: Platform-wide real-time order monitoring with status filter and dispute resolution.
- **Coupons & Settings**: Create platform-wide promo vouchers (*FIRST50, CRAVEFEST, FLAT100*).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Socket.IO Client, Canvas-Confetti |
| **Backend** | Node.js (v22), Express.js, Socket.IO, JWT, bcryptjs, RESTful Architecture |
| **Database** | MongoDB / Mongoose with zero-dependency persistent universal storage engine fallback |
| **State Tracking** | Finite State Machine (FSM) enforcing valid status transitions |

---

## 🔑 Demo Accounts & Credentials

Fast 1-click login buttons are available on `/login`, or you can sign in directly with the following pre-seeded credentials:

| Interface Role | Email | Password | Quick Link |
|---|---|---|---|
| **Customer** | `customer@cravex.com` | `password123` | [`/restaurants`](http://localhost:5173/restaurants) |
| **Restaurant Owner** | `owner@cravex.com` | `password123` | [`/restaurant/dashboard`](http://localhost:5173/restaurant/dashboard) |
| **Delivery Partner** | `delivery@cravex.com` | `password123` | [`/delivery/dashboard`](http://localhost:5173/delivery/dashboard) |
| **Super Admin** | `admin@cravex.com` | `password123` | [`/admin/overview`](http://localhost:5173/admin/overview) |

---

## 🚀 Running the Application

### 1. Start Backend Server
```bash
cd server
npm start
# Runs on http://localhost:5001
```

### 2. Start Frontend Dev Server
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### 3. Re-seed Database (Optional)
```bash
cd server
npm run seed
# Populates 12 restaurants, 50+ menu items, pre-built orders, reviews, coupons & users
```

---

## 🧪 Testing the Complete Order Lifecycle

1. Open **[http://localhost:5173](http://localhost:5173)** in your browser.
2. Sign in as **Customer** (or click the *Role Switcher* in the top navbar).
3. Browse **Gustoso Sourdough Pizza Co.**, click **"ADD"** on *Margherita Burrata Speciale*, customize size and extra truffle oil, and add to cart.
4. Go to **Cart** (`/cart`), enter coupon `FIRST50` to receive 50% discount.
5. Proceed to **Checkout** (`/checkout`), choose delivery address and payment method (*UPI/Card/COD*), and click **"Place Order"**.
6. You are redirected to **Live Order Tracking** (`/order-tracking/:id`). Note your **4-digit Delivery Handover OTP**!
7. Switch to **Restaurant Owner** (`/restaurant/live-orders`). Listen for the chime, click **"Accept Order"**, **"Start Food Preparation"**, and **"Mark Meal Packed"**.
8. Switch to **Delivery Partner** (`/delivery/dashboard`). Click **"1. Order Picked Up"** and **"2. Start Transit"**.
9. Click **"3. Verify Customer OTP & Complete Delivery"**, enter the customer's 4-digit code.
10. Return to the customer window to see the confetti celebration, +CravePoints awarded, and completed status!

---

## 🌐 Production Deployment Guide

### A. Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new) and click **"Add New Project"**.
2. Select and import your GitHub repository: `MBindhu07/cravex`.
3. Vercel automatically detects the included `vercel.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   *(Or if setting "Root Directory" to `client`, the build command is `npm run build` and output directory is `dist`).*
4. *(Optional)* In **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-cravex-backend.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-cravex-backend.onrender.com`
5. Click **Deploy**. Your CraveX app will be live at `https://cravex.vercel.app`!

### B. Deploy Backend on Render (Free Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **"New Web Service"**.
2. Connect your repository: `MBindhu07/cravex`.
3. Configure the service:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. In **Environment Variables**:
   - `PORT`: `5001`
   - `JWT_SECRET`: `cravex_production_secret_key_2026`
   - `CLIENT_URL`: `https://your-vercel-domain.vercel.app`
5. Click **Create Web Service**. Render provides a live URL (e.g., `https://cravex-backend.onrender.com`).
6. Copy this URL and add it as `VITE_API_URL` on your Vercel project settings.
