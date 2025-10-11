/**
 * GitHub OAuth Integration
 * Handles OAuth flow for GitHub authentication
 */

import { OAuthApp } from '@octokit/oauth-app';
import { Octokit } from '@octokit/rest';

export interface GitHubOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUrl?: string;
}

export interface GitHubAuthResult {
  accessToken: string;
  tokenType: string;
  scope: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  email: string | null;
  name: string | null;
  avatarUrl: string;
}

/**
 * GitHub OAuth handler for server-side authentication
 */
export class GitHubOAuthService {
  private oauthApp: OAuthApp;
  private config: GitHubOAuthConfig;

  constructor(config: GitHubOAuthConfig) {
    this.config = config;
    this.oauthApp = new OAuthApp({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    });
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUrl || 'http://localhost:3001/api/auth/github/callback',
      scope: 'repo,read:user,user:email,workflow',
      state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<GitHubAuthResult> {
    const { authentication } = await this.oauthApp.createToken({
      code,
    });

    return {
      accessToken: authentication.token,
      tokenType: authentication.tokenType,
      scope: authentication.scopes.join(','),
    };
  }

  /**
   * Get authenticated user details
   */
  async getAuthenticatedUser(accessToken: string): Promise<GitHubUser> {
    const octokit = new Octokit({ auth: accessToken });
    const { data } = await octokit.users.getAuthenticated();

    return {
      id: data.id,
      login: data.login,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatar_url,
    };
  }

  /**
   * Verify token is valid
   */
  async verifyToken(accessToken: string): Promise<boolean> {
    try {
      const octokit = new Octokit({ auth: accessToken });
      await octokit.users.getAuthenticated();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Revoke access token
   */
  async revokeToken(accessToken: string): Promise<void> {
    await this.oauthApp.deleteToken({ token: accessToken });
  }
}

