/**
 * Supabase Browser Client
 * For use in Client Components with 'use client' directive
 */

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * SECURITY: Client-side Supabase client for browser usage
 * Used in Client Components with 'use client' directive
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Legacy export for backward compatibility
export const supabase = createClient();

export type SupabaseClient = ReturnType<typeof createClient>;
