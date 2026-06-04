'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, Lock, Bell, LogOut, Camera, Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/lib/store';
import { userApi } from '@/lib/api';
import { Address } from '@/types';
import { getInitials } from '@/lib/utils';

const SIDEBAR_ITEMS = [
  { id: 'profile', icon: User, label: 'My Profile' },
  { id: 'addresses', icon: MapPin, label: 'My Addresses' },
  { id: 'security', icon: Lock, label: 'Password & Security' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser, clearAuth } = useAuthStore();
  const { showToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (user) setForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone || '' });
    userApi.getAddresses().then(({ data }) => setAddresses(data.data)).catch(() => {});
  }, [isAuthenticated, user, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await userApi.updateProfile(form);
      updateUser(data.data);
      showToast('Profile updated successfully!');
    } catch { showToast('Failed to update profile', 'error'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) { showToast('Passwords do not match', 'error'); return; }
    setSaving(true);
    try {
      await userApi.changePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.new });
      showToast('Password changed successfully!');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch { showToast('Failed to change password', 'error'); }
    finally { setSaving(false); }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await userApi.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast('Address removed');
    } catch { showToast('Failed to remove address', 'error'); }
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="container-custom py-10">
      <h1 className="text-2xl font-display font-bold mb-8">My Account</h1>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="card p-5 text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center hover:bg-brand-700 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div><p className="font-bold text-gray-900">3</p><p className="text-gray-500">Orders</p></div>
              <div><p className="font-bold text-gray-900">5</p><p className="text-gray-500">Wishlist</p></div>
              <div><p className="font-bold text-gray-900">2</p><p className="text-gray-500">Reviews</p></div>
            </div>
          </div>

          {/* Nav */}
          <div className="card p-2">
            {SIDEBAR_ITEMS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-brand-50 text-brand-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <Icon className={`w-4 h-4 ${activeTab === id ? 'text-brand-600' : 'text-gray-500'}`} />
                {label}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <Link href="/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                <Package className="w-4 h-4 text-gray-500" /> My Orders
              </Link>
              <Link href="/wishlist" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                <Heart className="w-4 h-4 text-gray-500" /> Wishlist
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-6">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input value={user.email} disabled className="input-field opacity-60 cursor-not-allowed" />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" className="input-field" />
                </div>
              </div>
              <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Saved Addresses</h2>
                <button className="btn-primary text-sm py-2 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
              {addresses.length === 0 ? (
                <div className="text-center py-10">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No saved addresses</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-gray-200 rounded-2xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{addr.fullName}</span>
                            <span className="badge bg-gray-100 text-gray-600 text-xs">{addr.type}</span>
                            {addr.isDefault && <span className="badge bg-green-100 text-green-700 text-xs">Default</span>}
                          </div>
                          <p className="text-sm text-gray-600">{addr.line1}, {addr.city}</p>
                          <p className="text-sm text-gray-600">{addr.state} — {addr.pincode}</p>
                          <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-sm text-brand-600 hover:underline">Edit</button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-6">Change Password</h2>
              <div className="space-y-4 max-w-md">
                {[
                  { label: 'Current Password', key: 'current' },
                  { label: 'New Password', key: 'new' },
                  { label: 'Confirm New Password', key: 'confirm' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type="password"
                      value={passwordForm[key as keyof typeof passwordForm]}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                      className="input-field"
                    />
                  </div>
                ))}
                <button onClick={handleChangePassword} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  {saving ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Order Updates', desc: 'Get notified on order status changes', enabled: true },
                  { label: 'Offers & Promotions', desc: 'Exclusive deals and discounts', enabled: true },
                  { label: 'New Arrivals', desc: 'Be first to know about new products', enabled: false },
                  { label: 'Blog & Style Tips', desc: 'Weekly hair care and styling guides', enabled: true },
                  { label: 'Restock Alerts', desc: 'Notify when wishlist items are back', enabled: true },
                ].map(({ label, desc, enabled }) => (
                  <div key={label} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${enabled ? 'bg-brand-600' : 'bg-gray-300'} relative flex-shrink-0`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${enabled ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-6 text-sm py-2.5 px-6">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
