/**
 * Audit and Logging Types
 * Types for audit trails and system logging
 */

export type AuditLogId = string;

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'share'
  | 'permission-change'
  | 'rule-violation'
  | 'rule-enforcement';

export type AuditResource =
  | 'workspace'
  | 'file'
  | 'folder'
  | 'rule'
  | 'task'
  | 'user'
  | 'team'
  | 'settings';

export interface AuditLog {
  id: AuditLogId;
  userId: string;
  userName: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId: string;
  resourceName?: string;
  workspaceId?: string;
  details?: AuditDetails;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export interface AuditDetails {
  changes?: Record<string, { before: any; after: any }>;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface AuditQuery {
  userId?: string;
  workspaceId?: string;
  action?: AuditAction[];
  resource?: AuditResource[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface SystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
  source: string; // service/component name
  stack?: string; // error stack trace if applicable
}

