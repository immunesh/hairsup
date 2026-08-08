'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, Check, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useUIStore } from '@/lib/store';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useUIStore();
  
  const token = searchParams.get('token');
  
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!token) e.token = 'Reset token is missing from url';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.resetPassword({ token: token!, password: form.password });
      showToast('Password reset successfully. Please log in with your new password.', 'success');
      router.push('/login');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Password reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[!@#$%^&*]/.test(p)) score++;
    return score;
  })();

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];

  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-900">
          <p className="font-semibold mb-2">Invalid Reset Link</p>
          <p className="text-sm text-red-800">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </p>
        </div>
        <Link href="/forgot-password" className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">New Password</h1>
      <p className="text-gray-500 mb-8">Please enter your new password below.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 8 characters"
              className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className={`text-xs ${passwordStrength >= 3 ? 'text-green-600' : passwordStrength === 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                {strengthLabels[passwordStrength]} password
              </p>
            </div>
          )}
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter password"
              className={`input-field pl-10 pr-10 ${errors.confirm ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {form.confirm && form.password === form.confirm && (
              <Check className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
        </div>

        {errors.token && <p className="text-red-500 text-xs">{errors.token}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Resetting Password…</> : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{
              width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
              top: `${i * 15}%`, left: `${i % 2 === 0 ? -20 : 60}%`, opacity: 0.5,
            }} />
          ))}
        </div>
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white">HairsUp</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            Secured Access
          </h2>
          <p className="text-white/70 text-lg">
            Choose a strong password to secure your HairsUp account and protect your orders and personal data.
          </p>
        </div>
        <p className="text-white/40 text-xs relative z-10">© 2025 HairsUp Technologies Pvt. Ltd.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-brand-600" />
            <span className="text-xl font-display font-bold text-gradient">HairsUp</span>
          </div>

          <Suspense fallback={
            <div className="max-w-md w-full mx-auto text-center space-y-4">
              <div className="flex justify-center"><Loader2 className="w-12 h-12 text-brand-600 animate-spin" /></div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Loading...</h1>
            </div>
          }>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
