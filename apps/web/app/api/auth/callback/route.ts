/**
 * Auth Callback Route
 * Handles OAuth callbacks and email confirmations from Supabase
 * SECURITY: Exchanges auth code for session and sets httpOnly cookies
 */

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/sandbox';

  if (code) {
    const supabase = await createServerSupabaseClient();
    
    // SECURITY: Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL('/login?error=auth_callback_failed', requestUrl.origin)
      );
    }
  }

  // Redirect to the specified next URL or default to sandbox
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

