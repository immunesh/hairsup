'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useUIStore } from '@/lib/store';

export default function ForgotPasswordPage() {
  const { showToast } = useUIStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
      showToast('If the email is registered, a password reset link has been sent.', 'success');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to send password reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

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
            Reset Your Password
          </h2>
          <p className="text-white/70 text-lg">
            Forgot your password? No worries, we&apos;ve got you covered. Enter your registered email to receive a recovery link.
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

          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Forgot Password</h1>
          
          {submitted ? (
            <div className="space-y-6">
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 text-brand-900">
                <p className="font-semibold mb-2">Check your email</p>
                <p className="text-sm text-brand-800">
                  We&apos;ve sent a password reset link to <strong className="text-brand-950">{email}</strong>.
                  Please check your inbox (and spam folder) and click the link to reset your password.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => setSubmitted(false)} className="btn-primary w-full py-3.5 text-base">
                  Resend Link
                </button>
                <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 font-semibold hover:text-gray-900 hover:underline">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-gray-500">
                Enter the email address associated with your account, and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="you@example.com"
                      className={`input-field pl-10 ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending Link…</> : 'Send Reset Link'}
                </button>
              </form>

              <div className="pt-2">
                <Link href="/login" className="flex items-center gap-2 text-sm text-brand-600 font-semibold hover:underline">
                  <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
