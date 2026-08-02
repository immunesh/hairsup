'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import Toast from '@/components/ui/Toast';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
      {/* Sign-in and registration report every failure through showToast. The
          shop layout renders this, but these pages sit outside it, so without
          it a rejected login looked like the button simply did nothing. */}
      <Toast />
    </GoogleOAuthProvider>
  );
}
