/**
 * GitHub OAuth Authorization Endpoint
 * Initiates the OAuth flow by redirecting to GitHub
 */

import { NextRequest, NextResponse } from 'next/server';
import { GitHubOAuthService } from '@ava/git-bridge';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'GitHub OAuth not configured' },
        { status: 500 }
      );
    }

    const oauthService = new GitHubOAuthService({
      clientId,
      clientSecret,
      redirectUrl: `${request.nextUrl.origin}/api/auth/github/callback`,
    });

    // Generate state for CSRF protection
    const state = randomBytes(32).toString('hex');

    // Store state in session/cookie (in production, use encrypted session)
    const response = NextResponse.redirect(oauthService.getAuthorizationUrl(state));
    response.cookies.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json({ error: 'OAuth initialization failed' }, { status: 500 });
  }
}

