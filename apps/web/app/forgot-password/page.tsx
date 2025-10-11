'use client';

/**
 * Forgot Password Page
 * Send password reset email
 */

import { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Gugi } from 'next/font/google';

const gugi = Gugi({ weight: '400', subsets: ['latin'] });

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleResetPassword}
        className="grid w-full max-w-sm grid-cols-1 gap-8"
      >
        <Link href="/" className="mx-auto">
          <span className={`text-2xl font-bold dark:text-white ${gugi.className}`}>
            AVA
          </span>
        </Link>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200">
              Check your email for the password reset link!
            </p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading || success}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading || success}>
          {loading ? 'Sending...' : 'Reset password'}
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

