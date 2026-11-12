import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Users, Lock, Unlock, Copy, Plus, ShoppingCart, Clock, Check } from 'lucide-react';
import api from '../../services/api.ts';
import { joinGroupRoom, getSocket } from '../../services/socket.ts';
import { GroupOrder, FoodItem } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import FoodCustomizationModal from '../../components/customer/FoodCustomizationModal.tsx';

export const GroupOrderingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const restaurantIdParam = searchParams.get('restaurantId') || 'rest-1';
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [group, setGroup] = useState<GroupOrder | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize group or join
  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      const res = await api.createGroupOrder(restaurantIdParam, 45);
      if (res.success && res.group) {
        setGroup(res.group);
        joinGroupRoom(res.group.code);
        addToast('Group Room Created! 👥', `Share code ${res.group.code} with your friends.`, 'success');
        loadRestaurantMenu(res.group.restaurantId);
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinByCode = async (codeToJoin?: string) => {
    const code = (codeToJoin || joinCodeInput).trim().toUpperCase();
    if (!code) return;
    setLoading(true);

    try {
      const res = await api.getGroupByCode(code);
      if (res.success && res.group) {
        setGroup(res.group);
        joinGroupRoom(res.group.code);
        addToast('Joined Room! 🍕', `Joined ${res.group.hostName}'s feast room.`, 'success');
        loadRestaurantMenu(res.group.restaurantId);
      }
    } catch (err: any) {
      addToast('Cannot Join', err.message || 'Invalid group code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurantMenu = async (restId: string) => {
    try {
      const res = await api.getRestaurantById(restId);
      if (res.success) {
        setMenuItems(res.menuItems || []);
      }
    } catch (err) {
      // ignore
    }
  };

  // Socket updates listener
  useEffect(() => {
    if (!group) return;

    const socket = getSocket();
    const handleGroupUpdated = (updatedGroup: GroupOrder) => {
      setGroup(updatedGroup);
    };

    socket.on('group_updated', handleGroupUpdated);
    return () => {
      socket.off('group_updated', handleGroupUpdated);
    };
  }, [group]);

  const handleCopyLink = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.code);
    addToast('Code Copied! 📋', `Share code ${group.code} with your squad.`, 'info');
  };

  const handleToggleLock = async () => {
    if (!group) return;
    try {
      const res = await api.toggleLockGroup(group.code);
      if (res.success) {
        setGroup(res.group);
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Could not toggle lock', 'error');
    }
  };

  const handleAddItemToGroup = async (food: FoodItem) => {
    if (!group) return;
    if (group.locked) {
      addToast('Cart Locked 🔒', 'The host has locked this group cart from further edits.', 'warning');
      return;
    }

    try {
      const res = await api.addItemToGroup(group.code, {
        foodItemId: food._id,
        quantity: 1,
      });
      if (res.success) {
        setGroup(res.group);
        addToast('Item Added! 🍽️', `${food.name} added to your tray.`, 'success');
      }
    } catch (err: any) {
      addToast('Error', err.message || 'Could not add item', 'error');
    }
  };

  // Calculate combined total across all participants
  const combinedTotal = (group?.participants || []).reduce((sum, p) => {
    return sum + (p.items || []).reduce((pSum, it) => pSum + it.itemTotal, 0);
  }, 0);

  const isHost = group && user && group.hostId === user._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* If No Active Group: Create or Join Screen */}
      {!group ? (
        <div className="max-w-xl mx-auto py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-950/70 text-4xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            👥
          </div>
          <h1 className="font-display font-extrabold text-3xl text-charcoal-900 dark:text-white">
            CraveX Group Dine Room
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            Order together with roommates, friends, or colleagues. Each person picks their favorite meal, combined into one delivery!
          </p>

          <div className="mt-8 p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft space-y-6">
            <div>
              <button
                onClick={handleCreateGroup}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                + Create New Group Order Room
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex-grow h-px bg-gray-200 dark:bg-charcoal-700" />
              <span>OR JOIN WITH CODE</span>
              <span className="flex-grow h-px bg-gray-200 dark:bg-charcoal-700" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="ENTER 6-DIGIT CODE"
                className="flex-grow px-4 py-3 rounded-2xl bg-gray-50 dark:bg-charcoal-700 border border-gray-200 dark:border-charcoal-600 font-mono font-bold text-center text-sm uppercase tracking-widest focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleJoinByCode()}
                className="px-6 py-3 rounded-2xl bg-charcoal-800 dark:bg-charcoal-700 text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Active Group Order Workspace */
        <div>
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-800 border border-orange-100 dark:border-charcoal-700 shadow-soft mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-extrabold text-xs tracking-wider">
                  ROOM CODE: {group.code}
                </span>
                <span className="text-xs text-gray-400">
                  Host: <strong>{group.hostName}</strong>
                </span>
              </div>
              <h2 className="font-display font-extrabold text-xl text-charcoal-900 dark:text-white">
                Ordering from {group.restaurantName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-charcoal-700 text-primary font-bold text-xs flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Share Code</span>
              </button>

              {isHost && (
                <button
                  onClick={handleToggleLock}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                    group.locked
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {group.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{group.locked ? 'Unlock Cart' : 'Lock Cart'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Synchronized Participants Tray */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
                <h3 className="font-display font-bold text-sm text-charcoal-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>Squad Tray ({group.participants.length} Friends)</span>
                  <span className="font-mono text-primary font-black">Total: ₹{combinedTotal}</span>
                </h3>

                <div className="space-y-4">
                  {group.participants.map((participant) => (
                    <div
                      key={participant.userId}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-charcoal-750 border border-gray-100 dark:border-charcoal-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-charcoal-800 dark:text-white flex items-center gap-1.5">
                          <span>👤</span>
                          <span>{participant.name}</span>
                          {participant.userId === user?._id && (
                            <span className="text-[10px] text-primary font-semibold">(You)</span>
                          )}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {participant.items.length} items
                        </span>
                      </div>

                      {participant.items.length === 0 ? (
                        <p className="text-[11px] text-gray-400 italic">Thinking about what to order...</p>
                      ) : (
                        <div className="space-y-1.5">
                          {participant.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-charcoal-700 dark:text-gray-300">
                              <span>{it.quantity}x {it.name}</span>
                              <span className="font-semibold">₹{it.itemTotal}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Combined Checkout Action */}
              {isHost && (
                <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-extrabold text-sm text-purple-900 dark:text-purple-100">
                        Host Controls
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        Lock the cart and place the combined order for everyone.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/cart')}
                      className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Check Out Squad Feast (₹{combinedTotal})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Menu Picker for this Group */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-orange-100 dark:border-charcoal-700 shadow-soft">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-charcoal-800 dark:text-white mb-4">
                  Add From {group.restaurantName} Menu
                </h4>

                <div className="max-h-[500px] overflow-y-auto space-y-3 pr-1">
                  {menuItems.map((food) => (
                    <div
                      key={food._id}
                      className="p-3 rounded-2xl bg-gray-50 dark:bg-charcoal-750 flex items-center justify-between gap-3 border border-gray-100 dark:border-charcoal-700"
                    >
                      <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-xs text-charcoal-800 dark:text-white truncate">{food.name}</p>
                        <p className="text-[10px] text-gray-500">₹{food.price}</p>
                      </div>
                      <button
                        onClick={() => handleAddItemToGroup(food)}
                        disabled={group.locked}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-600 disabled:opacity-40 transition-colors shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupOrderingPage;
