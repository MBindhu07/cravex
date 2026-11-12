import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle2, XCircle, Shield } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar.tsx';
import api from '../../services/api.ts';
import { User } from '../../types/index.ts';
import { useNotifications } from '../../context/NotificationContext.tsx';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();

  const fetchUsers = async () => {
    try {
      const res = await api.getAllUsers(roleFilter);
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (user: User) => {
    try {
      const res = await api.toggleUserStatus(user._id);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: !u.isActive } : u))
        );
        addToast(
          'User Status Updated',
          `${user.name} is now ${!user.isActive ? 'Active' : 'Deactivated'}`,
          'info'
        );
      }
    } catch (err: any) {
      addToast('Error', err.message, 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminSidebar />

      <main className="flex-grow p-6 lg:p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 dark:text-white">
              User Directory ({users.length})
            </h1>
            <p className="text-xs text-charcoal-500 dark:text-gray-400">
              Manage platform customers, restaurant partners, delivery riders, and access controls
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-4 border border-purple-100 dark:border-charcoal-700 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-soft">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-charcoal-700 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'customer', 'restaurant', 'delivery', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  roleFilter === r
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-gray-50 dark:bg-charcoal-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-charcoal-800 rounded-3xl border border-purple-100 dark:border-charcoal-700 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-charcoal-750 text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-charcoal-700">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-charcoal-700">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-charcoal-750/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-charcoal-900 dark:text-white">{u.name}</p>
                          <p className="text-[11px] text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="capitalize px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-[11px]">
                      {u.phone || '—'}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {u.isActive !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                          u.isActive !== false
                            ? 'text-red-600 border-red-200 hover:bg-red-50'
                            : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {u.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
