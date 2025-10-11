/**
 * Supabase Server Client
 * For use in Server Components and Route Handlers only
 * IMPORTANT: Do not import this in Client Components
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * SECURITY: Server-side Supabase client for Server Components and Route Handlers
 * Handles cookie-based auth with httpOnly cookies
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // SAFETY: Called from Server Component; cookie setting handled by middleware
        }
      },
    },
  });
}

