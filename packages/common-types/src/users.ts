/**
 * User and Team Types
 * Types for users, roles, permissions, and teams
 */

export type UserId = string;
export type TeamId = string;

export type UserRole = 'admin' | 'manager' | 'teamMember' | 'viewer';

export interface User {
  id: UserId;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  teamIds: TeamId[];
  preferences: UserPreferences;
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  defaultWorkspaceView: 'tree' | 'list' | 'kanban';
  emailDigest: 'daily' | 'weekly' | 'never';
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  ruleViolations: boolean;
  taskAssignments: boolean;
  taskMentions: boolean;
  taskDeadlines: boolean;
}

export interface Team {
  id: TeamId;
  name: string;
  description?: string;
  workspaceIds: string[];
  memberIds: UserId[];
  ownerId: UserId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  resource: ResourceType;
  action: PermissionAction;
  scope?: 'own' | 'team' | 'all';
}

export type ResourceType = 
  | 'workspace'
  | 'file'
  | 'rule'
  | 'task'
  | 'user'
  | 'team';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'share'
  | 'enforce';

export const RolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    { resource: 'workspace', action: 'create' },
    { resource: 'workspace', action: 'read', scope: 'all' },
    { resource: 'workspace', action: 'update', scope: 'all' },
    { resource: 'workspace', action: 'delete', scope: 'all' },
    { resource: 'rule', action: 'create' },
    { resource: 'rule', action: 'update', scope: 'all' },
    { resource: 'rule', action: 'delete', scope: 'all' },
    { resource: 'rule', action: 'enforce' },
    { resource: 'user', action: 'create' },
    { resource: 'user', action: 'update', scope: 'all' },
    { resource: 'user', action: 'delete', scope: 'all' },
  ],
  manager: [
    { resource: 'workspace', action: 'read', scope: 'team' },
    { resource: 'workspace', action: 'update', scope: 'team' },
    { resource: 'rule', action: 'create' },
    { resource: 'rule', action: 'update', scope: 'team' },
    { resource: 'task', action: 'create' },
    { resource: 'task', action: 'update', scope: 'team' },
    { resource: 'task', action: 'delete', scope: 'team' },
  ],
  teamMember: [
    { resource: 'workspace', action: 'read', scope: 'team' },
    { resource: 'file', action: 'create' },
    { resource: 'file', action: 'update', scope: 'own' },
    { resource: 'task', action: 'read', scope: 'team' },
    { resource: 'task', action: 'update', scope: 'own' },
  ],
  viewer: [
    { resource: 'workspace', action: 'read', scope: 'team' },
    { resource: 'file', action: 'read', scope: 'team' },
    { resource: 'task', action: 'read', scope: 'team' },
  ],
};

