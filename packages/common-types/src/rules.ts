/**
 * Rules Engine Types
 * Types for compliance rules, validation, and enforcement
 */

export type RuleId = string;
export type RuleTemplateId = string;

export type RuleType = 
  | 'filename'      // Regex pattern for file names
  | 'filesize'      // Max file size limit
  | 'extension'     // Allowed/forbidden extensions
  | 'metadata'      // Metadata field requirements
  | 'content'       // Content pattern matching
  | 'path'          // Path structure requirements
  | 'custom';       // Custom validation logic

export type RuleSeverity = 'error' | 'warning' | 'info';

export interface Rule {
  id: RuleId;
  workspaceId: string;
  name: string;
  description: string;
  type: RuleType;
  severity: RuleSeverity;
  enabled: boolean;
  config: RuleConfig;
  scope: RuleScope;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface RuleConfig {
  // For filename rules
  pattern?: string; // regex pattern
  
  // For filesize rules
  maxSizeMB?: number;
  
  // For extension rules
  allowedExtensions?: string[];
  forbiddenExtensions?: string[];
  
  // For metadata rules
  requiredFields?: string[];
  fieldValidation?: Record<string, FieldValidator>;
  
  // For content rules
  contentPattern?: string;
  matchMode?: 'must-match' | 'must-not-match';
  
  // For path rules
  pathPattern?: string;
  allowedPaths?: string[];
  forbiddenPaths?: string[];
  
  // Custom configuration
  customConfig?: Record<string, any>;
}

export interface FieldValidator {
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum';
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  enumValues?: string[];
}

export interface RuleScope {
  // Apply to specific paths
  includePaths?: string[]; // glob patterns
  excludePaths?: string[]; // glob patterns
  
  // Apply to specific file types
  fileTypes?: string[];
  
  // Apply to specific tags
  tags?: string[];
  
  // Apply to all if not specified
  applyToAll?: boolean;
}

export interface RuleTemplate {
  id: RuleTemplateId;
  name: string;
  description: string;
  category: string;
  type: RuleType;
  icon?: string;
  config: Partial<RuleConfig>;
  exampleUsage?: string;
  isBuiltIn: boolean;
}

export interface RuleViolation {
  id: string;
  ruleId: RuleId;
  fileNodeId: string;
  severity: RuleSeverity;
  message: string;
  context: ViolationContext;
  detectedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNote?: string;
}

export interface ViolationContext {
  filePath: string;
  lineNumber?: number;
  columnNumber?: number;
  snippet?: string;
  suggestedFix?: string;
}

export interface RuleCheckResult {
  passed: boolean;
  violations: RuleViolation[];
  checkedAt: Date;
  totalChecked: number;
  totalViolations: number;
}

