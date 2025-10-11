'use client';

/**
 * Providers Component
 * Wraps the app with necessary context providers
 */

import { AuthProvider } from '@/lib/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}

