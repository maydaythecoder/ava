/**
 * Workflow and Automation Types
 * Types for CI/CD workflows and automation pipelines
 */

export type WorkflowId = string;
export type WorkflowType = 'github-actions' | 'gitlab-ci' | 'circleci' | 'jenkins';

export interface Workflow {
  id: WorkflowId;
  repositoryId: string;
  name: string;
  fileName: string; // e.g., "ci.yml"
  filePath: string; // e.g., ".github/workflows/ci.yml"
  type: WorkflowType;
  content: string; // Raw YAML content
  summary: string | null; // AI-generated English summary
  status: WorkflowStatus;
  triggers: Trigger[];
  agents: string[]; // Agent IDs
  dependencies: string[]; // Other workflow IDs this depends on
  metadata: WorkflowMetadata;
  createdAt: Date;
  updatedAt: Date;
  lastRunAt: Date | null;
}

export type WorkflowStatus = 'active' | 'disabled' | 'draft' | 'error';

export interface WorkflowMetadata {
  jobCount?: number;
  stepCount?: number;
  estimatedDuration?: number; // seconds
  complexity?: 'simple' | 'moderate' | 'complex';
  tags?: string[];
  ownerId?: string;
  teamId?: string;
}

export interface Trigger {
  id: string;
  type: TriggerType;
  description: string;
  config: TriggerConfig;
}

export type TriggerType = 
  | 'push'
  | 'pull_request'
  | 'schedule'
  | 'workflow_dispatch'
  | 'webhook'
  | 'release'
  | 'issue_comment';

export interface TriggerConfig {
  branches?: string[];
  paths?: string[];
  tags?: string[];
  schedule?: string; // Cron expression
  events?: string[];
  [key: string]: any;
}

export interface WorkflowDependency {
  sourceWorkflowId: WorkflowId;
  targetWorkflowId: WorkflowId;
  dependencyType: 'triggers' | 'requires' | 'sequential';
  description?: string;
}

export interface WorkflowVersion {
  id: string;
  workflowId: WorkflowId;
  version: number;
  content: string;
  summary: string | null;
  changedBy: string;
  changeMessage?: string;
  createdAt: Date;
}

export interface WorkflowGraph {
  workflowId: WorkflowId;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowNode {
  id: string;
  type: 'job' | 'step' | 'trigger' | 'agent';
  label: string;
  agentType?: AgentType;
  metadata?: Record<string, any>;
}

export interface WorkflowEdge {
  source: string; // Node ID
  target: string; // Node ID
  type: 'depends_on' | 'triggers' | 'sequence';
  label?: string;
}

export type AgentType = 'watcher' | 'notifier' | 'runner' | 'pipeline';

export interface Agent {
  id: string;
  workflowId: WorkflowId;
  name: string;
  type: AgentType;
  description: string; // AI-generated explanation
  jobName?: string; // GitHub Actions job name
  stepIndex?: number; // Step index within job
  config: AgentConfig;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  runs?: string; // Command or script
  uses?: string; // Action reference
  with?: Record<string, any>; // Action inputs
  env?: Record<string, string>;
  if?: string; // Conditional expression
  [key: string]: any;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: AgentType;
  icon?: string;
  template: Partial<Agent>;
  exampleUsage?: string;
  isBuiltIn: boolean;
}


