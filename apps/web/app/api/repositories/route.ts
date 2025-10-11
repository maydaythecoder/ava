/**
 * Repositories API Endpoint
 * Fetches GitHub repositories for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { GitHubClient } from '@ava/git-bridge';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('github_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const client = new GitHubClient(accessToken);
    const searchParams = request.nextUrl.searchParams;
    
    const repositories = await client.listRepositories({
      page: parseInt(searchParams.get('page') || '1'),
      perPage: parseInt(searchParams.get('perPage') || '30'),
      sort: (searchParams.get('sort') as 'created' | 'updated' | 'pushed' | 'full_name') || 'updated',
    });

    return NextResponse.json({ repositories });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}

