/**
 * Sign Out Route
 * Clears Supabase session and redirects to login
 * SECURITY: Clears httpOnly auth cookies
 */

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  
  // SECURITY: Clear session server-side
  await supabase.auth.signOut();
  
  return NextResponse.redirect(new URL('/login', request.url));
}

