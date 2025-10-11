-- Ava Platform - Migration to Automation & Agent Management System
-- This migration transforms the compliance platform into an automation management system

-- ============================================================================
-- STEP 1: Create new tables for automation management
-- ============================================================================

-- Repositories table (GitHub/GitLab connections)
CREATE TABLE public.repositories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'gitlab', 'bitbucket')),
  full_name TEXT NOT NULL, -- owner/repo format
  display_name TEXT NOT NULL,
  default_branch TEXT NOT NULL DEFAULT 'main',
  url TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT NOT NULL CHECK (sync_status IN ('pending', 'syncing', 'success', 'error')) DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, provider, full_name)
);

-- Workflows table (CI/CD workflow files)
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repository_id UUID NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('github-actions', 'gitlab-ci', 'circleci', 'jenkins')),
  content TEXT NOT NULL,
  summary TEXT, -- AI-generated natural language summary
  status TEXT NOT NULL CHECK (status IN ('active', 'disabled', 'draft', 'error')) DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_run_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(repository_id, file_path)
);

-- Agents table (individual automation units - AI agents with prompts and context)
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  folder_path TEXT NOT NULL, -- Path where agent is defined (e.g., "/backend/api")
  name TEXT NOT NULL,
  file_name TEXT NOT NULL, -- e.g., "code-reviewer.ava"
  prompt TEXT NOT NULL, -- Main agent prompt/instruction
  context TEXT, -- Additional context for the agent
  context_links TEXT[], -- Array of URLs/links for context
  context_mcp_servers TEXT[], -- Array of MCP server references
  
  -- Trigger configuration
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('on_commit', 'hourly', 'daily', 'on_change', 'manual')),
  trigger_config JSONB DEFAULT '{}'::jsonb,
  
  -- Scope configuration
  scope JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Agent metadata
  type TEXT CHECK (type IN ('watcher', 'notifier', 'runner', 'pipeline')),
  enabled BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES public.users(id),
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_run_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(workspace_id, folder_path, file_name)
);

-- Agent executions table (track when agents run)
CREATE TABLE public.agent_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed', 'cancelled')),
  trigger_source TEXT NOT NULL, -- What triggered this execution
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER
);

-- Workflow dependencies table
CREATE TABLE public.workflow_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  target_workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  dependency_type TEXT NOT NULL CHECK (dependency_type IN ('triggers', 'requires', 'sequential')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_workflow_id, target_workflow_id)
);

-- Workflow versions table
CREATE TABLE public.workflow_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  changed_by UUID NOT NULL REFERENCES public.users(id),
  change_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent templates table (built-in and custom agent templates)
CREATE TABLE public.agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE, -- NULL for built-in templates
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('watcher', 'notifier', 'runner', 'pipeline')),
  icon TEXT,
  prompt_template TEXT NOT NULL,
  context_template TEXT,
  default_trigger TEXT NOT NULL CHECK (default_trigger IN ('on_commit', 'hourly', 'daily', 'on_change', 'manual')),
  default_scope JSONB DEFAULT '{}'::jsonb,
  example_usage TEXT,
  is_built_in BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation insights table (redundancies, conflicts, optimization suggestions)
CREATE TABLE public.automation_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('redundancy', 'conflict', 'optimization', 'security', 'missing_owner', 'unused', 'failure_pattern', 'dependency_issue')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'error')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  related_workflows UUID[],
  related_agents UUID[],
  actionable BOOLEAN DEFAULT false,
  suggested_action TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.users(id)
);

-- ============================================================================
-- STEP 2: Create indexes for performance
-- ============================================================================

CREATE INDEX idx_repositories_workspace ON public.repositories(workspace_id);
CREATE INDEX idx_repositories_provider ON public.repositories(provider);

CREATE INDEX idx_workflows_repository ON public.workflows(repository_id);
CREATE INDEX idx_workflows_status ON public.workflows(status);

CREATE INDEX idx_agents_workspace ON public.agents(workspace_id);
CREATE INDEX idx_agents_folder_path ON public.agents(folder_path);
CREATE INDEX idx_agents_trigger_type ON public.agents(trigger_type);
CREATE INDEX idx_agents_enabled ON public.agents(enabled);

CREATE INDEX idx_agent_executions_agent ON public.agent_executions(agent_id);
CREATE INDEX idx_agent_executions_status ON public.agent_executions(status);
CREATE INDEX idx_agent_executions_started_at ON public.agent_executions(started_at);

CREATE INDEX idx_workflow_dependencies_source ON public.workflow_dependencies(source_workflow_id);
CREATE INDEX idx_workflow_dependencies_target ON public.workflow_dependencies(target_workflow_id);

CREATE INDEX idx_workflow_versions_workflow ON public.workflow_versions(workflow_id);

CREATE INDEX idx_agent_templates_workspace ON public.agent_templates(workspace_id);
CREATE INDEX idx_agent_templates_category ON public.agent_templates(category);

CREATE INDEX idx_automation_insights_workspace ON public.automation_insights(workspace_id);
CREATE INDEX idx_automation_insights_type ON public.automation_insights(type);

-- ============================================================================
-- STEP 3: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_insights ENABLE ROW LEVEL SECURITY;

-- Repositories: Users can access repositories in their workspaces
CREATE POLICY "Users can read repositories in accessible workspaces" ON public.repositories
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM public.workspaces
      WHERE owner_id = auth.uid() OR
      id IN (
        SELECT workspace_id FROM public.workspace_teams wt
        JOIN public.team_members tm ON wt.team_id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage repositories in owned workspaces" ON public.repositories
  FOR ALL USING (
    workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid())
  );

-- Workflows: Inherit repository/workspace access
CREATE POLICY "Users can read workflows in accessible repositories" ON public.workflows
  FOR SELECT USING (
    repository_id IN (
      SELECT id FROM public.repositories
      WHERE workspace_id IN (
        SELECT id FROM public.workspaces
        WHERE owner_id = auth.uid() OR
        id IN (
          SELECT workspace_id FROM public.workspace_teams wt
          JOIN public.team_members tm ON wt.team_id = tm.team_id
          WHERE tm.user_id = auth.uid()
        )
      )
    )
  );

-- Agents: Users can access agents in their workspaces
CREATE POLICY "Users can read agents in accessible workspaces" ON public.agents
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM public.workspaces
      WHERE owner_id = auth.uid() OR
      id IN (
        SELECT workspace_id FROM public.workspace_teams wt
        JOIN public.team_members tm ON wt.team_id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage agents in accessible workspaces" ON public.agents
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM public.workspaces
      WHERE owner_id = auth.uid() OR
      id IN (
        SELECT workspace_id FROM public.workspace_teams wt
        JOIN public.team_members tm ON wt.team_id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
  );

-- Agent executions: Users can view executions of their agents
CREATE POLICY "Users can read agent executions" ON public.agent_executions
  FOR SELECT USING (
    agent_id IN (
      SELECT id FROM public.agents
      WHERE workspace_id IN (
        SELECT id FROM public.workspaces
        WHERE owner_id = auth.uid() OR
        id IN (
          SELECT workspace_id FROM public.workspace_teams wt
          JOIN public.team_members tm ON wt.team_id = tm.team_id
          WHERE tm.user_id = auth.uid()
        )
      )
    )
  );

-- Agent templates: Everyone can read built-in, workspace members can read custom
CREATE POLICY "Users can read built-in agent templates" ON public.agent_templates
  FOR SELECT USING (is_built_in = true);

CREATE POLICY "Users can read workspace agent templates" ON public.agent_templates
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM public.workspaces
      WHERE owner_id = auth.uid() OR
      id IN (
        SELECT workspace_id FROM public.workspace_teams wt
        JOIN public.team_members tm ON wt.team_id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
  );

-- Automation insights: Workspace access
CREATE POLICY "Users can read insights in accessible workspaces" ON public.automation_insights
  FOR SELECT USING (
    workspace_id IN (
      SELECT id FROM public.workspaces
      WHERE owner_id = auth.uid() OR
      id IN (
        SELECT workspace_id FROM public.workspace_teams wt
        JOIN public.team_members tm ON wt.team_id = tm.team_id
        WHERE tm.user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- STEP 4: Triggers for automatic timestamp updates
-- ============================================================================

CREATE TRIGGER update_repositories_updated_at BEFORE UPDATE ON public.repositories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_templates_updated_at BEFORE UPDATE ON public.agent_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 5: Insert built-in agent templates
-- ============================================================================

INSERT INTO public.agent_templates (name, description, category, type, icon, prompt_template, context_template, default_trigger, default_scope, is_built_in) VALUES
('Code Reviewer', 'Automatically review code changes and provide feedback on commits', 'Development', 'watcher', '🔍', 'Review the code changes in this commit. Check for:\n- Code quality issues\n- Potential bugs\n- Security vulnerabilities\n- Best practice violations\n\nProvide constructive feedback.', 'Repository context: {{REPO_NAME}}\nLanguage: {{PRIMARY_LANGUAGE}}', 'on_commit', '{"applyToAll": true}'::jsonb, true),

('Security Scanner', 'Scan code for security vulnerabilities and potential issues', 'Security', 'runner', '🔒', 'Scan the codebase for security issues:\n- Check for exposed secrets or API keys\n- Identify SQL injection vulnerabilities\n- Check for XSS vulnerabilities\n- Review authentication/authorization logic', 'Focus on files in: {{SCOPE_PATHS}}', 'on_commit', '{"includePaths": ["src/", "app/"]}'::jsonb, true),

('Documentation Generator', 'Generate or update documentation based on code changes', 'Documentation', 'runner', '📚', 'Generate documentation for the changed code:\n- Function/method documentation\n- API endpoint descriptions\n- Usage examples\n- Update README if needed', 'Documentation style: {{DOC_STYLE}}\nTarget audience: {{AUDIENCE}}', 'on_change', '{"includePaths": ["src/", "lib/"]}'::jsonb, true),

('Test Generator', 'Generate unit tests for new or modified code', 'Testing', 'runner', '🧪', 'Generate comprehensive unit tests for the code:\n- Test happy paths\n- Test edge cases\n- Test error handling\n- Ensure high coverage', 'Testing framework: {{TEST_FRAMEWORK}}\nCoverage target: {{COVERAGE_TARGET}}%', 'on_change', '{"includePaths": ["src/", "lib/"]}'::jsonb, true),

('Deployment Notifier', 'Send notifications when deployments succeed or fail', 'Operations', 'notifier', '🚀', 'Send deployment notification:\n- Deployment status: {{STATUS}}\n- Environment: {{ENVIRONMENT}}\n- Version: {{VERSION}}\n- Changes included', 'Notification channels: {{CHANNELS}}\nMention: {{MENTIONS}}', 'on_commit', '{"applyToAll": true}'::jsonb, true),

('Performance Monitor', 'Monitor code changes for performance implications', 'Performance', 'watcher', '⚡', 'Analyze code changes for performance impact:\n- Check for inefficient algorithms\n- Identify N+1 queries\n- Review caching strategies\n- Flag potential bottlenecks', 'Performance targets: {{TARGETS}}\nCritical paths: {{CRITICAL_PATHS}}', 'on_change', '{"includePaths": ["src/api/", "src/services/"]}'::jsonb, true),

('Dependency Updater', 'Check and suggest updates for outdated dependencies', 'Maintenance', 'runner', '📦', 'Check for outdated dependencies:\n- Identify security updates\n- Suggest version upgrades\n- Check for breaking changes\n- Provide migration guidance', 'Package managers: {{PACKAGE_MANAGERS}}\nUpdate strategy: {{STRATEGY}}', 'daily', '{"applyToAll": true}'::jsonb, true),

('Compliance Checker', 'Ensure code meets compliance and regulatory requirements', 'Compliance', 'watcher', '✅', 'Check code changes for compliance:\n- Regulatory requirements: {{REGULATIONS}}\n- Internal policies\n- Data handling practices\n- Audit trail requirements', 'Compliance standards: {{STANDARDS}}\nCritical requirements: {{CRITICAL}}', 'on_commit', '{"applyToAll": true}'::jsonb, true);

-- ============================================================================
-- Notes on backward compatibility
-- ============================================================================

-- The original tables (file_nodes, rules, rule_violations) are kept for now
-- to maintain backward compatibility during migration.
-- They can be dropped once full migration is complete and data is migrated.

-- To complete migration:
-- 1. Migrate existing workspace data if needed
-- 2. Test new agent creation and execution
-- 3. Verify RLS policies work correctly
-- 4. Drop old tables: rule_violations, rules (rename to rules_legacy first)


