/**
 * Prompt Templates for AI Translation
 * 
 * SECURITY: These prompts are structured to prevent prompt injection
 * by clearly separating instructions from user-provided content
 */

export const YAML_TO_ENGLISH_PROMPT = `You are an expert at explaining CI/CD workflows in clear, natural language.

Your task is to analyze a workflow YAML file and create a concise, human-readable summary.

Focus on:
1. What the workflow does (purpose)
2. When it triggers (events)
3. Key steps and actions
4. Important integrations or deployments

Keep the summary:
- Clear and concise (2-4 sentences)
- Non-technical where possible
- Focused on business value

The YAML content will be provided below. Explain what this workflow does:

---YAML START---
{{YAML_CONTENT}}
---YAML END---

Provide only the natural language summary, no additional commentary.`;

export const ENGLISH_TO_YAML_PROMPT = `You are an expert at writing GitHub Actions workflows.

Your task is to generate a valid GitHub Actions YAML workflow based on a natural language description.

Follow these rules:
1. Generate valid YAML syntax
2. Use standard GitHub Actions structure (name, on, jobs)
3. Use common, well-maintained actions (e.g., actions/checkout@v4)
4. Include appropriate error handling
5. Follow security best practices

The user's description will be provided below. Generate a workflow:

---DESCRIPTION START---
{{DESCRIPTION}}
---DESCRIPTION END---

Provide only the YAML workflow, no additional commentary.`;

export const EXPLAIN_AGENT_PROMPT = `You are an expert at explaining automation components.

Your task is to explain what a specific job or step does in a CI/CD workflow.

Keep the explanation:
- One clear sentence
- Non-technical language where possible
- Focused on the "what" and "why"

The agent configuration will be provided below. Explain what this does:

---CONFIG START---
{{CONFIG}}
---CONFIG END---

Provide only the explanation, no additional commentary.`;

export const COMPARE_WORKFLOWS_PROMPT = `You are an expert at analyzing CI/CD workflows.

Your task is to compare two workflows and identify:
1. Similarities (shared triggers, actions, or purposes)
2. Key differences
3. Potential redundancies or conflicts
4. Recommendations for consolidation or optimization

The workflows will be provided below:

---WORKFLOW 1---
{{WORKFLOW_1}}
---WORKFLOW 1 END---

---WORKFLOW 2---
{{WORKFLOW_2}}
---WORKFLOW 2 END---

Provide a structured comparison with actionable insights.`;

export const DETECT_ISSUES_PROMPT = `You are an expert at reviewing CI/CD workflows for issues.

Your task is to analyze a workflow and identify:
1. Security concerns (secrets exposure, unsafe actions)
2. Performance issues (redundant steps, inefficient caching)
3. Reliability problems (missing error handling, flaky tests)
4. Best practice violations

The workflow will be provided below:

---WORKFLOW START---
{{WORKFLOW}}
---WORKFLOW END---

Provide a list of issues with severity (high/medium/low) and recommendations.`;

/**
 * SECURITY: Template injection prevention
 * Ensures user content is properly sandboxed within delimiters
 */
export function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    // SAFETY: Replace only exact placeholder matches, prevent injection
    result = result.replace(placeholder, sanitizeContent(value));
  }
  
  return result;
}

/**
 * SECURITY: Sanitize user-provided content
 * Prevents prompt injection by escaping control sequences
 */
function sanitizeContent(content: string): string {
  // Remove potential prompt injection patterns
  let sanitized = content;
  
  // Escape delimiter patterns to prevent breaking out of content sections
  sanitized = sanitized.replace(/---YAML START---/g, '---YAML-START---');
  sanitized = sanitized.replace(/---YAML END---/g, '---YAML-END---');
  sanitized = sanitized.replace(/---DESCRIPTION START---/g, '---DESCRIPTION-START---');
  sanitized = sanitized.replace(/---DESCRIPTION END---/g, '---DESCRIPTION-END---');
  sanitized = sanitized.replace(/---CONFIG START---/g, '---CONFIG-START---');
  sanitized = sanitized.replace(/---CONFIG END---/g, '---CONFIG-END---');
  
  return sanitized;
}


