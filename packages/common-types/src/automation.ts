/**
 * Automation Insights and Analysis Types
 * Types for analyzing and understanding automations
 */

import { WorkflowId, AgentType } from './workflow';

export interface AutomationInsight {
  id: string;
  workspaceId: string;
  type: InsightType;
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  relatedWorkflows: WorkflowId[];
  relatedAgents: string[];
  actionable: boolean;
  suggestedAction?: string;
  detectedAt: Date;
  resolvedAt?: Date;
}

export type InsightType =
  | 'redundancy'        // Duplicate workflows
  | 'conflict'          // Conflicting automations
  | 'optimization'      // Can be improved
  | 'security'          // Security concern
  | 'missing_owner'     // No owner assigned
  | 'unused'            // Never triggered
  | 'failure_pattern'   // Frequently failing
  | 'dependency_issue'; // Circular or broken deps

export interface AutomationStats {
  workspaceId: string;
  totalRepositories: number;
  totalWorkflows: number;
  activeWorkflows: number;
  totalAgents: number;
  agentsByType: Record<AgentType, number>;
  insightCounts: Record<InsightType, number>;
  lastUpdated: Date;
}

export interface WorkflowComparison {
  workflow1Id: WorkflowId;
  workflow2Id: WorkflowId;
  similarity: number; // 0-1
  commonTriggers: string[];
  commonAgents: string[];
  differences: string[];
  recommendation?: string;
}

export interface AutomationMap {
  workspaceId: string;
  repositories: RepositoryNode[];
  workflows: WorkflowMapNode[];
  connections: MapConnection[];
}

export interface RepositoryNode {
  id: string;
  name: string;
  provider: string;
  workflowCount: number;
}

export interface WorkflowMapNode {
  id: string;
  repositoryId: string;
  name: string;
  type: string;
  agentCount: number;
  status: string;
  position?: { x: number; y: number };
}

export interface MapConnection {
  source: string;
  target: string;
  type: 'triggers' | 'depends_on' | 'shared_resource';
  label?: string;
}


