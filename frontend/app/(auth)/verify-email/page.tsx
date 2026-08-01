'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useUIStore } from '@/lib/store';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { showToast } = useUIStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing or invalid email verification token.');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(data.message || 'Your email has been verified successfully!');
        showToast('Email verified successfully! You can now log in.', 'success');
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired or is invalid.');
        showToast(error.response?.data?.message || 'Verification failed', 'error');
      }
    };

    verify();
  }, [token, showToast]);

  return (
    <div className="max-w-md w-full mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-brand-600 animate-pulse" />
        </div>
      </div>

      {status === 'loading' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Verifying Email</h1>
          <p className="text-gray-500">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Verified!</h1>
            <p className="text-gray-500">{message}</p>
          </div>
          <Link href="/login" className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
            Proceed to Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-500">{message}</p>
          </div>
          <div className="space-y-3">
            <Link href="/register" className="btn-primary w-full py-3.5 text-base flex items-center justify-center">
              Back to Registration
            </Link>
            <Link href="/login" className="block text-sm text-brand-600 font-semibold hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-brand-950 via-brand-800 to-purple-700">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-600" />
        </div>
        <Suspense fallback={
          <div className="max-w-md w-full mx-auto text-center space-y-4">
            <div className="flex justify-center"><Loader2 className="w-12 h-12 text-brand-600 animate-spin" /></div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Loading...</h1>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
