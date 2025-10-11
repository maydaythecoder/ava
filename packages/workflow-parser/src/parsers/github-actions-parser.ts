import * as yaml from 'js-yaml';
import { ParsedWorkflow, ParsedTrigger, ParsedJob, ParsedStep, ParseResult, WorkflowValidation } from '../types';
import { Workflow, WorkflowGraph, WorkflowNode, WorkflowEdge, AgentType } from '@ava/common-types';

/**
 * SECURITY: YAML parsing with safe load to prevent code execution
 */
export class GitHubActionsParser {
  /**
   * Parse GitHub Actions YAML to structured workflow
   */
  parse(yamlContent: string, fileName: string = 'workflow.yml'): ParseResult {
    try {
      // SECURITY: Use safeLoad to prevent arbitrary code execution
      const data = yaml.load(yamlContent, { schema: yaml.DEFAULT_SCHEMA }) as any;
      
      if (!data || typeof data !== 'object') {
        return {
          success: false,
          error: 'Invalid YAML: Root must be an object'
        };
      }

      const warnings: string[] = [];
      
      // Parse workflow name
      const name = data.name || fileName.replace('.yml', '').replace('.yaml', '');
      
      // Parse triggers
      const triggers = this.parseTriggers(data.on);
      
      // Parse jobs
      const jobs = this.parseJobs(data.jobs || {});
      
      if (jobs.length === 0) {
        warnings.push('No jobs defined in workflow');
      }

      const workflow: ParsedWorkflow = {
        name,
        fileName,
        triggers,
        jobs,
        env: data.env,
        defaults: data.defaults
      };

      return {
        success: true,
        workflow,
        warnings: warnings.length > 0 ? warnings : undefined
      };
    } catch (error) {
      return {
        success: false,
        error: `YAML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse trigger configuration
   */
  private parseTriggers(onConfig: any): ParsedTrigger[] {
    const triggers: ParsedTrigger[] = [];
    
    if (!onConfig) {
      return triggers;
    }

    // Handle simple string or array format
    if (typeof onConfig === 'string') {
      triggers.push({ type: onConfig, config: {} });
      return triggers;
    }

    if (Array.isArray(onConfig)) {
      onConfig.forEach(event => {
        triggers.push({ type: event, config: {} });
      });
      return triggers;
    }

    // Handle object format with detailed config
    if (typeof onConfig === 'object') {
      Object.keys(onConfig).forEach(eventType => {
        const config = onConfig[eventType];
        triggers.push({
          type: eventType,
          config: typeof config === 'object' ? config : {}
        });
      });
    }

    return triggers;
  }

  /**
   * Parse jobs
   */
  private parseJobs(jobsConfig: Record<string, any>): ParsedJob[] {
    const jobs: ParsedJob[] = [];
    
    Object.entries(jobsConfig).forEach(([jobId, jobData]: [string, any]) => {
      if (!jobData || typeof jobData !== 'object') {
        return;
      }

      const steps = this.parseSteps(jobData.steps || []);
      
      jobs.push({
        id: jobId,
        name: jobData.name || jobId,
        runsOn: jobData['runs-on'] || 'ubuntu-latest',
        needs: Array.isArray(jobData.needs) ? jobData.needs : (jobData.needs ? [jobData.needs] : undefined),
        steps,
        env: jobData.env,
        if: jobData.if,
        timeoutMinutes: jobData['timeout-minutes']
      });
    });

    return jobs;
  }

  /**
   * Parse steps
   */
  private parseSteps(stepsConfig: any[]): ParsedStep[] {
    const steps: ParsedStep[] = [];
    
    stepsConfig.forEach((stepData, index) => {
      if (!stepData || typeof stepData !== 'object') {
        return;
      }

      steps.push({
        id: `step-${index}`,
        name: stepData.name,
        uses: stepData.uses,
        run: stepData.run,
        with: stepData.with,
        env: stepData.env,
        if: stepData.if
      });
    });

    return steps;
  }

  /**
   * Convert parsed workflow back to YAML
   */
  toYAML(workflow: ParsedWorkflow): string {
    const data: any = {
      name: workflow.name
    };

    // Add triggers
    if (workflow.triggers.length > 0) {
      if (workflow.triggers.length === 1 && Object.keys(workflow.triggers[0].config).length === 0) {
        data.on = workflow.triggers[0].type;
      } else {
        data.on = {};
        workflow.triggers.forEach(trigger => {
          data.on[trigger.type] = Object.keys(trigger.config).length > 0 ? trigger.config : undefined;
        });
      }
    }

    // Add env
    if (workflow.env) {
      data.env = workflow.env;
    }

    // Add jobs
    if (workflow.jobs.length > 0) {
      data.jobs = {};
      workflow.jobs.forEach(job => {
        const jobData: any = {
          name: job.name !== job.id ? job.name : undefined,
          'runs-on': job.runsOn
        };

        if (job.needs && job.needs.length > 0) {
          jobData.needs = job.needs.length === 1 ? job.needs[0] : job.needs;
        }

        if (job.env) {
          jobData.env = job.env;
        }

        if (job.if) {
          jobData.if = job.if;
        }

        if (job.timeoutMinutes) {
          jobData['timeout-minutes'] = job.timeoutMinutes;
        }

        // Add steps
        jobData.steps = job.steps.map(step => {
          const stepData: any = {};
          if (step.name) stepData.name = step.name;
          if (step.uses) stepData.uses = step.uses;
          if (step.run) stepData.run = step.run;
          if (step.with) stepData.with = step.with;
          if (step.env) stepData.env = step.env;
          if (step.if) stepData.if = step.if;
          return stepData;
        });

        data.jobs[job.id] = jobData;
      });
    }

    return yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
  }

  /**
   * Validate workflow structure
   */
  validate(workflow: ParsedWorkflow): WorkflowValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for jobs
    if (!workflow.jobs || workflow.jobs.length === 0) {
      errors.push('Workflow must have at least one job');
    }

    // Check job dependencies
    const jobIds = new Set(workflow.jobs.map(j => j.id));
    workflow.jobs.forEach(job => {
      if (job.needs) {
        job.needs.forEach(depId => {
          if (!jobIds.has(depId)) {
            errors.push(`Job "${job.id}" depends on non-existent job "${depId}"`);
          }
        });
      }

      // Check for steps
      if (!job.steps || job.steps.length === 0) {
        warnings.push(`Job "${job.id}" has no steps`);
      }

      // Check steps have either uses or run
      job.steps.forEach((step, idx) => {
        if (!step.uses && !step.run) {
          warnings.push(`Step ${idx + 1} in job "${job.id}" has neither 'uses' nor 'run'`);
        }
      });
    });

    // Check for circular dependencies
    const circular = this.detectCircularDependencies(workflow.jobs);
    if (circular.length > 0) {
      errors.push(`Circular dependencies detected: ${circular.join(' -> ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Detect circular dependencies in job needs
   */
  private detectCircularDependencies(jobs: ParsedJob[]): string[] {
    const graph = new Map<string, string[]>();
    jobs.forEach(job => {
      graph.set(job.id, job.needs || []);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    const dfs = (jobId: string): boolean => {
      if (recStack.has(jobId)) {
        const cycleStart = path.indexOf(jobId);
        return true;
      }
      if (visited.has(jobId)) {
        return false;
      }

      visited.add(jobId);
      recStack.add(jobId);
      path.push(jobId);

      const dependencies = graph.get(jobId) || [];
      for (const dep of dependencies) {
        if (dfs(dep)) {
          return true;
        }
      }

      recStack.delete(jobId);
      path.pop();
      return false;
    };

    for (const jobId of graph.keys()) {
      if (dfs(jobId)) {
        return path;
      }
    }

    return [];
  }

  /**
   * Generate workflow graph for visualization
   */
  generateGraph(workflow: ParsedWorkflow): WorkflowGraph {
    const nodes: WorkflowNode[] = [];
    const edges: WorkflowEdge[] = [];

    // Add trigger nodes
    workflow.triggers.forEach((trigger, idx) => {
      nodes.push({
        id: `trigger-${idx}`,
        type: 'trigger',
        label: trigger.type,
        metadata: trigger.config
      });
    });

    // Add job nodes
    workflow.jobs.forEach(job => {
      nodes.push({
        id: job.id,
        type: 'job',
        label: job.name,
        metadata: {
          runsOn: job.runsOn,
          stepCount: job.steps.length
        }
      });

      // Connect triggers to jobs
      if (!job.if && workflow.triggers.length > 0) {
        workflow.triggers.forEach((_, idx) => {
          edges.push({
            source: `trigger-${idx}`,
            target: job.id,
            type: 'triggers'
          });
        });
      }

      // Add job dependencies
      if (job.needs) {
        job.needs.forEach(depId => {
          edges.push({
            source: depId,
            target: job.id,
            type: 'depends_on'
          });
        });
      }

      // Add step nodes and edges
      job.steps.forEach((step, idx) => {
        const stepId = `${job.id}-${step.id}`;
        const agentType = this.inferAgentType(step);
        
        nodes.push({
          id: stepId,
          type: 'step',
          label: step.name || step.uses || step.run?.substring(0, 30) || 'Step',
          agentType,
          metadata: {
            uses: step.uses,
            run: step.run
          }
        });

        // Connect to previous step or job
        const sourceId = idx === 0 ? job.id : `${job.id}-step-${idx - 1}`;
        edges.push({
          source: sourceId,
          target: stepId,
          type: 'sequence'
        });
      });
    });

    return {
      workflowId: '', // Will be set by caller
      nodes,
      edges
    };
  }

  /**
   * Infer agent type from step configuration
   */
  private inferAgentType(step: ParsedStep): AgentType {
    const usesLower = step.uses?.toLowerCase() || '';
    const runLower = step.run?.toLowerCase() || '';
    const nameLower = step.name?.toLowerCase() || '';

    // Notifier patterns
    if (usesLower.includes('slack') || 
        usesLower.includes('notification') ||
        usesLower.includes('discord') ||
        nameLower.includes('notify') ||
        nameLower.includes('alert')) {
      return 'notifier';
    }

    // Watcher patterns
    if (nameLower.includes('checkout') ||
        nameLower.includes('fetch') ||
        nameLower.includes('download') ||
        usesLower.includes('actions/checkout')) {
      return 'watcher';
    }

    // Pipeline patterns (complex multi-step)
    if (usesLower.includes('deploy') ||
        usesLower.includes('workflow') ||
        nameLower.includes('pipeline')) {
      return 'pipeline';
    }

    // Default to runner
    return 'runner';
  }
}


