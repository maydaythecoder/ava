/**
 * GitHub API Client
 * Provides methods to interact with GitHub repositories
 */

import { Octokit } from '@octokit/rest';

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  defaultBranch: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

export interface WorkflowFile {
  name: string;
  path: string;
  sha: string;
  content: string;
}

export interface RepositoryTree {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

/**
 * GitHub API client for repository operations
 */
export class GitHubClient {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  /**
   * List user repositories
   */
  async listRepositories(options?: {
    perPage?: number;
    page?: number;
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  }): Promise<Repository[]> {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      per_page: options?.perPage || 30,
      page: options?.page || 1,
      sort: options?.sort || 'updated',
      direction: 'desc',
    });

    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      defaultBranch: repo.default_branch,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
    }));
  }

  /**
   * Get repository details
   */
  async getRepository(owner: string, repo: string): Promise<Repository> {
    const { data } = await this.octokit.repos.get({ owner, repo });

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      private: data.private,
      defaultBranch: data.default_branch,
      owner: {
        login: data.owner.login,
        avatarUrl: data.owner.avatar_url,
      },
    };
  }

  /**
   * List workflow files in .github/workflows
   */
  async listWorkflowFiles(owner: string, repo: string): Promise<WorkflowFile[]> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: '.github/workflows',
      });

      if (!Array.isArray(data)) {
        return [];
      }

      const workflowFiles: WorkflowFile[] = [];
      
      for (const file of data) {
        if (file.type === 'file' && (file.name.endsWith('.yml') || file.name.endsWith('.yaml'))) {
          const content = await this.getFileContent(owner, repo, file.path);
          workflowFiles.push({
            name: file.name,
            path: file.path,
            sha: file.sha,
            content,
          });
        }
      }

      return workflowFiles;
    } catch (error: unknown) {
      // SECURITY: Safely handle API errors without exposing internal details
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return []; // No workflows directory
      }
      throw new Error('Failed to fetch workflow files');
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    const { data } = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in data && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    throw new Error('File content not available');
  }

  /**
   * Get repository file tree
   */
  async getTree(
    owner: string,
    repo: string,
    treeSha?: string,
    recursive = true
  ): Promise<RepositoryTree[]> {
    const { data } = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: treeSha || 'HEAD',
      recursive: recursive ? 'true' : undefined,
    });

    return data.tree.map((item) => ({
      path: item.path || '',
      mode: item.mode || '',
      type: item.type as 'blob' | 'tree',
      sha: item.sha || '',
      size: item.size,
    }));
  }

  /**
   * Create or update file in repository
   */
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<void> {
    await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
    });
  }

  /**
   * Delete file from repository
   */
  async deleteFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    sha: string
  ): Promise<void> {
    await this.octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha,
    });
  }
}

