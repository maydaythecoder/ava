import { OpenAIClient, OpenAIConfig } from './openai-client';
import {
  fillTemplate,
  YAML_TO_ENGLISH_PROMPT,
  ENGLISH_TO_YAML_PROMPT,
  EXPLAIN_AGENT_PROMPT,
  COMPARE_WORKFLOWS_PROMPT,
  DETECT_ISSUES_PROMPT
} from './prompt-templates';

export type WorkflowType = 'github-actions' | 'gitlab-ci' | 'circleci';

export interface TranslationResult {
  success: boolean;
  content: string;
  error?: string;
  tokensUsed?: number;
}

export interface ComparisonResult {
  success: boolean;
  similarities: string[];
  differences: string[];
  recommendations: string[];
  error?: string;
}

export interface IssueDetectionResult {
  success: boolean;
  issues: WorkflowIssue[];
  error?: string;
}

export interface WorkflowIssue {
  severity: 'high' | 'medium' | 'low';
  category: 'security' | 'performance' | 'reliability' | 'best-practice';
  description: string;
  recommendation: string;
}

/**
 * Workflow Translator
 * 
 * Translates between YAML workflows and natural language
 * using OpenAI's GPT models
 */
export class WorkflowTranslator {
  private client: OpenAIClient;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAIClient(config);
  }

  /**
   * Convert YAML workflow to natural language summary
   * 
   * SECURITY: YAML content is sandboxed in prompt template
   */
  async yamlToEnglish(yaml: string, type: WorkflowType = 'github-actions'): Promise<TranslationResult> {
    try {
      // SAFETY: Content length validation to prevent excessive API costs
      if (yaml.length > 50000) {
        return {
          success: false,
          content: '',
          error: 'YAML content too large (max 50KB)'
        };
      }

      const prompt = fillTemplate(YAML_TO_ENGLISH_PROMPT, {
        YAML_CONTENT: yaml
      });

      const summary = await this.client.generateCompletion(prompt, {
        maxTokens: 500
      });

      return {
        success: true,
        content: summary
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  /**
   * Convert natural language description to YAML workflow
   * 
   * SECURITY: User description is sandboxed in prompt template
   */
  async englishToYAML(description: string, type: WorkflowType = 'github-actions'): Promise<TranslationResult> {
    try {
      // SAFETY: Description length validation
      if (description.length > 5000) {
        return {
          success: false,
          content: '',
          error: 'Description too long (max 5000 characters)'
        };
      }

      const prompt = fillTemplate(ENGLISH_TO_YAML_PROMPT, {
        DESCRIPTION: description
      });

      const yaml = await this.client.generateCompletion(prompt, {
        maxTokens: 2000,
        temperature: 0.2 // Lower temperature for more deterministic YAML generation
      });

      // Extract YAML from code blocks if present
      const cleanedYaml = this.extractYAML(yaml);

      return {
        success: true,
        content: cleanedYaml
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  /**
   * Explain what a specific agent/step does
   */
  async explainAgent(agentConfig: Record<string, any>): Promise<TranslationResult> {
    try {
      const configStr = JSON.stringify(agentConfig, null, 2);
      
      const prompt = fillTemplate(EXPLAIN_AGENT_PROMPT, {
        CONFIG: configStr
      });

      const explanation = await this.client.generateCompletion(prompt, {
        maxTokens: 200
      });

      return {
        success: true,
        content: explanation
      };
    } catch (error) {
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Explanation failed'
      };
    }
  }

  /**
   * Compare two workflows and identify similarities/differences
   */
  async compareWorkflows(workflow1: string, workflow2: string): Promise<ComparisonResult> {
    try {
      const prompt = fillTemplate(COMPARE_WORKFLOWS_PROMPT, {
        WORKFLOW_1: workflow1,
        WORKFLOW_2: workflow2
      });

      const comparison = await this.client.generateCompletion(prompt, {
        maxTokens: 1000
      });

      // Parse the structured comparison
      // (In production, would use structured output or JSON mode)
      return {
        success: true,
        similarities: this.extractListFromSection(comparison, 'similarities'),
        differences: this.extractListFromSection(comparison, 'differences'),
        recommendations: this.extractListFromSection(comparison, 'recommendations')
      };
    } catch (error) {
      return {
        success: false,
        similarities: [],
        differences: [],
        recommendations: [],
        error: error instanceof Error ? error.message : 'Comparison failed'
      };
    }
  }

  /**
   * Detect issues in a workflow
   */
  async detectIssues(yaml: string): Promise<IssueDetectionResult> {
    try {
      const prompt = fillTemplate(DETECT_ISSUES_PROMPT, {
        WORKFLOW: yaml
      });

      const analysis = await this.client.generateCompletion(prompt, {
        maxTokens: 1500
      });

      // Parse issues from the analysis
      // (In production, would use structured output)
      const issues = this.parseIssues(analysis);

      return {
        success: true,
        issues
      };
    } catch (error) {
      return {
        success: false,
        issues: [],
        error: error instanceof Error ? error.message : 'Issue detection failed'
      };
    }
  }

  /**
   * Extract YAML from markdown code blocks
   * SAFETY: Handles various markdown formatting patterns
   */
  private extractYAML(content: string): string {
    // Remove markdown code blocks
    const yamlBlockMatch = content.match(/```(?:yaml|yml)?\n([\s\S]*?)```/);
    if (yamlBlockMatch) {
      return yamlBlockMatch[1].trim();
    }
    return content.trim();
  }

  /**
   * Extract list items from a section of text
   */
  private extractListFromSection(text: string, sectionName: string): string[] {
    const lines = text.split('\n');
    const items: string[] = [];
    let inSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes(sectionName)) {
        inSection = true;
        continue;
      }
      if (inSection && line.trim().startsWith('-')) {
        items.push(line.replace(/^-\s*/, '').trim());
      }
      if (inSection && line.trim() === '') {
        break;
      }
    }

    return items;
  }

  /**
   * Parse issues from analysis text
   */
  private parseIssues(analysis: string): WorkflowIssue[] {
    // Simple parsing - in production would use structured output
    const issues: WorkflowIssue[] = [];
    const lines = analysis.split('\n');

    for (const line of lines) {
      if (line.includes('high') || line.includes('High')) {
        issues.push({
          severity: 'high',
          category: 'security',
          description: line,
          recommendation: 'Review and fix immediately'
        });
      }
    }

    return issues;
  }

  /**
   * Health check for the AI service
   */
  async healthCheck(): Promise<boolean> {
    return this.client.healthCheck();
  }
}


