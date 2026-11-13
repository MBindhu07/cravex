const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5001/api';
    }
  }
  return '/api';
};

const API_BASE = getApiBase();

const getAuthHeaders = () => {
  const token = localStorage.getItem('cravex_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const api = {
  // Auth
  register: (payload: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  demoLogin: (role: string) => request<any>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (payload: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),

  // Restaurants
  getRestaurants: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
    });
    return request<any>(`/restaurants?${query.toString()}`);
  },
  getRestaurantById: (id: string) => request<any>(`/restaurants/${id}`),
  getMyRestaurant: () => request<any>('/restaurants/my/restaurant'),
  updateRestaurant: (id: string, payload: any) => request<any>(`/restaurants/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  addFoodItem: (payload: any) => request<any>('/restaurants/food-items', { method: 'POST', body: JSON.stringify(payload) }),
  updateFoodItem: (id: string, payload: any) => request<any>(`/restaurants/food-items/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteFoodItem: (id: string) => request<any>(`/restaurants/food-items/${id}`, { method: 'DELETE' }),
  getInventory: (restaurantId: string) => request<any>(`/restaurants/${restaurantId}/inventory`),
  updateInventoryItem: (id: string, payload: any) => request<any>(`/restaurants/inventory/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getRestaurantAnalytics: (restaurantId: string) => request<any>(`/restaurants/${restaurantId}/analytics`),

  // Orders
  createOrder: (payload: any) => request<any>('/orders', { method: 'POST', body: JSON.stringify(payload) }),
  getOrderById: (id: string) => request<any>(`/orders/${id}`),
  getMyOrders: () => request<any>('/orders/my-orders'),
  getRestaurantOrders: (restaurantId: string) => request<any>(`/orders/restaurant/${restaurantId}`),
  updateOrderStatus: (id: string, payload: any) => request<any>(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  cancelOrder: (id: string, reason?: string) => request<any>(`/orders/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),

  // Delivery Partner
  getAvailableDeliveries: () => request<any>('/delivery/available'),
  getMyDeliveries: () => request<any>('/delivery/my-deliveries'),
  acceptDelivery: (orderId: string) => request<any>('/delivery/accept', { method: 'POST', body: JSON.stringify({ orderId }) }),
  updateDeliveryStep: (orderId: string, nextStatus: string, otp?: string) =>
    request<any>('/delivery/step', { method: 'POST', body: JSON.stringify({ orderId, nextStatus, otp }) }),
  updateDeliveryLocation: (orderId: string, lat: number, lng: number) =>
    request<any>('/delivery/location', { method: 'POST', body: JSON.stringify({ orderId, lat, lng }) }),
  getDeliveryStats: () => request<any>('/delivery/stats'),

  // Group Ordering
  createGroupOrder: (restaurantId: string, deadlineMinutes = 30) =>
    request<any>('/groups/create', { method: 'POST', body: JSON.stringify({ restaurantId, deadlineMinutes }) }),
  getGroupByCode: (code: string) => request<any>(`/groups/${code}`),
  addItemToGroup: (code: string, payload: any) => request<any>(`/groups/${code}/add-item`, { method: 'POST', body: JSON.stringify(payload) }),
  toggleLockGroup: (code: string) => request<any>(`/groups/${code}/toggle-lock`, { method: 'PUT' }),

  // CraveBot AI
  chatWithCraveBot: (message: string, context: any = {}) =>
    request<any>('/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) }),

  // Gamification & Mood & Wheel & Budget
  getFoodByMood: (mood: string) => request<any>(`/gamification/mood?mood=${encodeURIComponent(mood)}`),
  spinTheWheel: (params: { vegOnly?: boolean; maxBudget?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.vegOnly) q.append('vegOnly', 'true');
    if (params.maxBudget) q.append('maxBudget', String(params.maxBudget));
    return request<any>(`/gamification/spin-wheel?${q.toString()}`);
  },
  getFoodPassport: () => request<any>('/gamification/food-passport'),
  getActivePolls: () => request<any>('/gamification/polls'),
  createFoodPoll: (title: string, options: string[]) =>
    request<any>('/gamification/polls', { method: 'POST', body: JSON.stringify({ title, options }) }),
  voteOnPoll: (pollId: string, optionId: string) =>
    request<any>('/gamification/polls/vote', { method: 'POST', body: JSON.stringify({ pollId, optionId }) }),
  getBudgetMeals: (budget: number) => request<any>(`/gamification/budget-combos?budget=${budget}`),
  redeemReward: (pointsCost: number, discountAmount: number) =>
    request<any>('/gamification/redeem-reward', { method: 'POST', body: JSON.stringify({ pointsCost, discountAmount }) }),

  // Super Admin
  getAdminOverview: () => request<any>('/admin/overview'),
  getAllUsers: (role?: string) => request<any>(`/admin/users?role=${role || 'all'}`),
  toggleUserStatus: (id: string) => request<any>(`/admin/users/${id}/toggle`, { method: 'PUT' }),
  getAllRestaurantsAdmin: () => request<any>('/admin/restaurants'),
  updateRestaurantApproval: (id: string, status: string) =>
    request<any>(`/admin/restaurants/${id}/approval`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getAllOrdersAdmin: (params: { status?: string; search?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.status) q.append('status', params.status);
    if (params.search) q.append('search', params.search);
    return request<any>(`/admin/orders?${q.toString()}`);
  },
  getCouponsAdmin: () => request<any>('/admin/coupons'),
  createCouponAdmin: (payload: any) => request<any>('/admin/coupons', { method: 'POST', body: JSON.stringify(payload) }),

  // Support
  createSupportTicket: (payload: any) => request<any>('/support', { method: 'POST', body: JSON.stringify(payload) }),
  getMyTickets: () => request<any>('/support/my-tickets'),
  getAllTicketsAdmin: () => request<any>('/support/all'),
  replyToTicket: (id: string, message: string, status?: string) =>
    request<any>(`/support/${id}/reply`, { method: 'POST', body: JSON.stringify({ message, status }) }),

  // Notifications
  getMyNotifications: () => request<any>('/notifications'),
  markNotificationAsRead: (id: string) => request<any>(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsAsRead: () => request<any>('/notifications/read-all', { method: 'PUT' }),
};

export default api;
