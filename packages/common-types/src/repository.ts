/**
 * Repository and Integration Types
 * Types for managing connected Git repositories
 */

export type RepositoryId = string;
export type RepositoryProvider = 'github' | 'gitlab' | 'bitbucket';

export interface Repository {
  id: RepositoryId;
  workspaceId: string;
  provider: RepositoryProvider;
  fullName: string; // owner/repo format
  displayName: string;
  defaultBranch: string;
  url: string;
  isPrivate: boolean;
  connectedAt: Date;
  lastSyncedAt: Date | null;
  syncStatus: SyncStatus;
  metadata: RepositoryMetadata;
}

export type SyncStatus = 'pending' | 'syncing' | 'success' | 'error';

export interface RepositoryMetadata {
  description?: string;
  stars?: number;
  language?: string;
  topics?: string[];
  lastCommitAt?: Date;
  workflowCount?: number;
}

export interface RepositoryConnection {
  id: string;
  workspaceId: string;
  provider: RepositoryProvider;
  accessToken: string; // Encrypted in DB
  refreshToken?: string; // Encrypted in DB
  expiresAt?: Date;
  scopes: string[];
  connectedBy: string; // User ID
  connectedAt: Date;
}

export interface RepositorySyncResult {
  repositoryId: RepositoryId;
  success: boolean;
  workflowsFound: number;
  workflowsAdded: number;
  workflowsUpdated: number;
  errors: string[];
  syncedAt: Date;
}


