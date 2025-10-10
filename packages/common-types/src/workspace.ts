/**
 * Workspace Types
 * Core types for workspace management and file structure
 */

export type WorkspaceId = string;
export type FileNodeId = string;

export interface Workspace {
  id: WorkspaceId;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  settings: WorkspaceSettings;
  rootNode: FileNodeId;
  isArchived: boolean;
}

export interface WorkspaceSettings {
  defaultBranchProtection: boolean;
  autoTaskGeneration: boolean;
  complianceMode: 'advisory' | 'enforcement' | 'sandbox';
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
}

export type FileNodeType = 'file' | 'folder';

export interface FileNode {
  id: FileNodeId;
  workspaceId: WorkspaceId;
  name: string;
  type: FileNodeType;
  parentId: FileNodeId | null;
  path: string; // Full path from root
  content?: string; // Only for files
  metadata: FileMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileMetadata {
  size?: number; // bytes
  mimeType?: string;
  extension?: string;
  author?: string;
  lastModifiedBy?: string;
  tags?: string[];
  customFields?: Record<string, any>;
}

export interface FileTreeNode extends FileNode {
  children?: FileTreeNode[];
}

export interface WorkspaceVersion {
  id: string;
  workspaceId: WorkspaceId;
  version: number;
  message: string;
  author: string;
  createdAt: Date;
  snapshot: FileTreeSnapshot;
}

export type FileTreeSnapshot = Record<FileNodeId, FileNode>;

