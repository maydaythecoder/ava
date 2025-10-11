'use client';

/**
 * Reset Password Page
 * Update password with reset token from email
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Gugi } from 'next/font/google';

const gugi = Gugi({ weight: '400', subsets: ['latin'] });

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success! Redirect to login
      router.push('/login?message=password_updated');
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleUpdatePassword}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Link href="/" className="mx-auto">
          <span className={`text-2xl font-bold dark:text-white ${gugi.className}`}>
            AVA
          </span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              New password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (min. 6 characters)"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Confirm password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update password'}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

