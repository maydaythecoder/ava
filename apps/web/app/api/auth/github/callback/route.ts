/**
 * GitHub OAuth Callback Endpoint
 * Handles the OAuth callback from GitHub
 */

import { NextRequest, NextResponse } from 'next/server';
import { GitHubOAuthService } from '@ava/git-bridge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/error?error=${error}`, request.nextUrl.origin)
      );
    }

    if (!code || !state) {
      return NextResponse.json({ error: 'Missing code or state' }, { status: 400 });
    }

    // Verify state (CSRF protection)
    const storedState = request.cookies.get('github_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'GitHub OAuth not configured' }, { status: 500 });
    }

    const oauthService = new GitHubOAuthService({
      clientId,
      clientSecret,
      redirectUrl: `${request.nextUrl.origin}/api/auth/github/callback`,
    });

    // Exchange code for token
    const authResult = await oauthService.exchangeCodeForToken(code);

    // Get user details
    const user = await oauthService.getAuthenticatedUser(authResult.accessToken);

    // In production, store token securely (encrypted session/database)
    const response = NextResponse.redirect(new URL('/sandbox', request.nextUrl.origin));
    
    // Store access token in httpOnly cookie (encrypt in production!)
    response.cookies.set('github_access_token', authResult.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Store user info in regular cookie for client access
    response.cookies.set('github_user', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    // Clear state cookie
    response.cookies.delete('github_oauth_state');

    return response;
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/error?error=oauth_failed', request.nextUrl.origin)
    );
  }
}

