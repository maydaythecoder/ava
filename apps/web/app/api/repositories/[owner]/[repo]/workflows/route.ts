/**
 * Workflows API Endpoint
 * Fetches GitHub Actions workflows for a repository
 */

import { NextRequest, NextResponse } from 'next/server';
import { GitHubClient } from '@ava/git-bridge';
import { GitHubActionsParser } from '@ava/workflow-parser';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    const accessToken = request.cookies.get('github_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const client = new GitHubClient(accessToken);

    // Fetch workflow files
    const workflowFiles = await client.listWorkflowFiles(owner, repo);

    // Parse each workflow
    const parser = new GitHubActionsParser();
    const workflows = workflowFiles.map((file) => {
      try {
        const parsed = parser.parse(file.content);
        return {
          name: file.name,
          path: file.path,
          sha: file.sha,
          workflow: parsed,
        };
      } catch (parseError) {
        console.error(`Error parsing workflow ${file.name}:`, parseError);
        return {
          name: file.name,
          path: file.path,
          sha: file.sha,
          error: 'Failed to parse workflow',
        };
      }
    });

    return NextResponse.json({ workflows });
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

