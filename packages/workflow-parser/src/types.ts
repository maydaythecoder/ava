/**
 * Internal types for workflow parsing
 */

export interface ParsedWorkflow {
  name: string;
  fileName: string;
  triggers: ParsedTrigger[];
  jobs: ParsedJob[];
  env?: Record<string, string>;
  defaults?: any;
}

export interface ParsedTrigger {
  type: string;
  config: Record<string, any>;
}

export interface ParsedJob {
  id: string;
  name: string;
  runsOn: string | string[];
  needs?: string[];
  steps: ParsedStep[];
  env?: Record<string, string>;
  if?: string;
  timeoutMinutes?: number;
}

export interface ParsedStep {
  id: string;
  name?: string;
  uses?: string;
  run?: string;
  with?: Record<string, any>;
  env?: Record<string, string>;
  if?: string;
}

export interface ParseResult {
  success: boolean;
  workflow?: ParsedWorkflow;
  error?: string;
  warnings?: string[];
}

export interface WorkflowValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}


