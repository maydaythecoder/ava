/**
 * Auth Layout Component
 * Centered layout for authentication pages following Catalyst UI patterns
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AuthLayoutProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function AuthLayout({ children, className, ...props }: AuthLayoutProps) {
  return (
    <main
      className={cn(
        'flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8',
        'bg-white dark:bg-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}

