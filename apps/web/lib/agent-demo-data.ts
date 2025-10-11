import { Agent, FolderNode } from '@/store/agent-store';

export function createDemoWorkspaceId(): string {
  return 'demo-workspace-1';
}

export function createDemoFolderTree(): FolderNode {
  return {
    id: 'root',
    name: 'My Project',
    path: '/',
    type: 'folder',
    children: [
      {
        id: 'frontend',
        name: 'frontend',
        path: '/frontend',
        type: 'folder',
        children: [
          {
            id: 'frontend-components',
            name: 'components',
            path: '/frontend/components',
            type: 'folder',
            children: [],
            agents: []
          },
          {
            id: 'frontend-pages',
            name: 'pages',
            path: '/frontend/pages',
            type: 'folder',
            children: [],
            agents: []
          }
        ],
        agents: []
      },
      {
        id: 'backend',
        name: 'backend',
        path: '/backend',
        type: 'folder',
        children: [
          {
            id: 'backend-api',
            name: 'api',
            path: '/backend/api',
            type: 'folder',
            children: [],
            agents: []
          },
          {
            id: 'backend-services',
            name: 'services',
            path: '/backend/services',
            type: 'folder',
            children: [],
            agents: []
          }
        ],
        agents: []
      },
      {
        id: 'tests',
        name: 'tests',
        path: '/tests',
        type: 'folder',
        children: [],
        agents: []
      },
      {
        id: 'docs',
        name: 'docs',
        path: '/docs',
        type: 'folder',
        children: [],
        agents: []
      }
    ],
    agents: []
  };
}

export function createDemoAgents(): Agent[] {
  const workspaceId = createDemoWorkspaceId();
  
  return [
    {
      id: 'agent-1',
      workspaceId,
      folderPath: '/backend/api',
      name: 'API Code Reviewer',
      fileName: 'api-code-reviewer.ava',
      prompt: 'Review all API endpoint changes for:\n- Input validation\n- Error handling\n- Security best practices\n- Documentation completeness\n\nProvide specific feedback on what needs improvement.',
      context: 'This API handles sensitive user data and payment information. All endpoints must be thoroughly validated and secured.',
      contextLinks: [
        'https://docs.company.com/api-guidelines',
        'https://owasp.org/www-project-api-security/'
      ],
      contextMcpServers: ['security-scanner', 'code-quality'],
      triggerType: 'on_commit',
      triggerConfig: {
        branches: ['main', 'develop'],
        paths: ['backend/api/**/*.ts']
      },
      scope: {
        includePaths: ['backend/api/'],
        fileTypes: ['ts', 'js']
      },
      type: 'watcher',
      enabled: true,
      ownerId: 'user-1',
      createdBy: 'user-1',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      lastRunAt: new Date('2024-01-20')
    },
    {
      id: 'agent-2',
      workspaceId,
      folderPath: '/frontend/components',
      name: 'Accessibility Checker',
      fileName: 'a11y-checker.ava',
      prompt: 'Check all UI components for accessibility issues:\n- ARIA labels\n- Keyboard navigation\n- Color contrast\n- Screen reader compatibility\n\nFlag any violations of WCAG 2.1 AA standards.',
      context: 'Our application must be fully accessible to users with disabilities. This is a legal requirement and core value.',
      contextLinks: [
        'https://www.w3.org/WAI/WCAG21/quickref/',
        'https://webaim.org/resources/contrastchecker/'
      ],
      contextMcpServers: ['a11y-validator'],
      triggerType: 'on_change',
      triggerConfig: {
        watchPaths: ['frontend/components/**/*']
      },
      scope: {
        includePaths: ['frontend/components/'],
        fileTypes: ['tsx', 'jsx']
      },
      type: 'watcher',
      enabled: true,
      ownerId: 'user-1',
      createdBy: 'user-1',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-18'),
      lastRunAt: new Date('2024-01-21')
    },
    {
      id: 'agent-3',
      workspaceId,
      folderPath: '/tests',
      name: 'Test Coverage Monitor',
      fileName: 'test-coverage.ava',
      prompt: 'Monitor test coverage and ensure:\n- All new code has corresponding tests\n- Coverage stays above 80%\n- Critical paths are fully tested\n\nNotify team if coverage drops.',
      context: 'We maintain high test coverage to catch bugs early and ensure reliability.',
      contextLinks: [
        'https://docs.company.com/testing-guidelines'
      ],
      contextMcpServers: ['coverage-reporter'],
      triggerType: 'daily',
      triggerConfig: {
        time: '09:00',
        timezone: 'UTC'
      },
      scope: {
        applyToAll: true
      },
      type: 'runner',
      enabled: true,
      ownerId: 'user-1',
      createdBy: 'user-1',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
      lastRunAt: new Date('2024-01-22')
    },
    {
      id: 'agent-4',
      workspaceId,
      folderPath: '/',
      name: 'Deployment Notifier',
      fileName: 'deploy-notifier.ava',
      prompt: 'Send deployment notifications to Slack:\n- Environment deployed to\n- Version/commit deployed\n- Who triggered the deployment\n- Link to deployment logs\n\nUse appropriate emoji based on success/failure.',
      context: 'Keep the team informed about all deployments.',
      contextLinks: [],
      contextMcpServers: ['slack-integration'],
      triggerType: 'on_commit',
      triggerConfig: {
        branches: ['production', 'staging'],
        afterSuccess: true
      },
      scope: {
        applyToAll: true
      },
      type: 'notifier',
      enabled: true,
      ownerId: 'user-2',
      createdBy: 'user-2',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12'),
      lastRunAt: new Date('2024-01-21')
    }
  ];
}

export function getAgentsForFolder(agents: Agent[], folderPath: string): Agent[] {
  return agents.filter(agent => agent.folderPath === folderPath);
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'watcher' | 'notifier' | 'runner' | 'pipeline';
  icon: string;
  promptTemplate: string;
  contextTemplate: string;
  defaultTrigger: 'on_commit' | 'hourly' | 'daily' | 'on_change' | 'manual';
}

export function getAgentTemplates(): AgentTemplate[] {
  return [
    {
      id: 'template-1',
      name: 'Code Reviewer',
      description: 'Review code changes for quality, security, and best practices',
      category: 'Development',
      type: 'watcher' as const,
      icon: '🔍',
      promptTemplate: 'Review the code changes and check for:\n- Code quality issues\n- Potential bugs\n- Security vulnerabilities\n- Best practice violations\n\nProvide constructive feedback.',
      contextTemplate: 'Repository context: {{REPO_NAME}}\nLanguage: {{PRIMARY_LANGUAGE}}',
      defaultTrigger: 'on_commit' as const
    },
    {
      id: 'template-2',
      name: 'Documentation Generator',
      description: 'Generate or update documentation based on code changes',
      category: 'Documentation',
      type: 'runner' as const,
      icon: '📚',
      promptTemplate: 'Generate documentation for the changed code:\n- Function/method documentation\n- API endpoint descriptions\n- Usage examples\n- Update README if needed',
      contextTemplate: 'Documentation style: {{DOC_STYLE}}\nTarget audience: {{AUDIENCE}}',
      defaultTrigger: 'on_change' as const
    },
    {
      id: 'template-3',
      name: 'Security Scanner',
      description: 'Scan code for security vulnerabilities',
      category: 'Security',
      type: 'runner' as const,
      icon: '🔒',
      promptTemplate: 'Scan the codebase for security issues:\n- Exposed secrets or API keys\n- SQL injection vulnerabilities\n- XSS vulnerabilities\n- Authentication/authorization issues',
      contextTemplate: 'Focus on files in: {{SCOPE_PATHS}}',
      defaultTrigger: 'on_commit' as const
    },
    {
      id: 'template-4',
      name: 'Test Generator',
      description: 'Generate unit tests for new or modified code',
      category: 'Testing',
      type: 'runner' as const,
      icon: '🧪',
      promptTemplate: 'Generate comprehensive unit tests:\n- Test happy paths\n- Test edge cases\n- Test error handling\n- Ensure high coverage',
      contextTemplate: 'Testing framework: {{TEST_FRAMEWORK}}\nCoverage target: {{COVERAGE_TARGET}}%',
      defaultTrigger: 'on_change' as const
    },
    {
      id: 'template-5',
      name: 'Slack Notifier',
      description: 'Send notifications to Slack channels',
      category: 'Operations',
      type: 'notifier' as const,
      icon: '💬',
      promptTemplate: 'Send notification to Slack:\n- Event: {{EVENT_TYPE}}\n- Status: {{STATUS}}\n- Details: {{DETAILS}}',
      contextTemplate: 'Channel: {{SLACK_CHANNEL}}\nMention: {{MENTIONS}}',
      defaultTrigger: 'on_commit' as const
    },
    {
      id: 'template-6',
      name: 'Performance Monitor',
      description: 'Monitor code changes for performance implications',
      category: 'Performance',
      type: 'watcher' as const,
      icon: '⚡',
      promptTemplate: 'Analyze code changes for performance impact:\n- Inefficient algorithms\n- N+1 queries\n- Caching opportunities\n- Potential bottlenecks',
      contextTemplate: 'Performance targets: {{TARGETS}}\nCritical paths: {{CRITICAL_PATHS}}',
      defaultTrigger: 'on_change' as const
    }
  ];
}


