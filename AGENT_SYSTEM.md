# Ava Agent System

## Overview

Ava has been transformed into an **AI Agent Management Platform** that allows teams to create, manage, and deploy custom AI agents that automate workflows based on triggers and scopes.

## What's New

### Core Concept

**Agents** are AI-powered automation units that:

- Run based on triggers (on commit, hourly, daily, on change, manual)
- Operate within defined scopes (all files, specific paths, or file types)
- Have context from links and MCP servers
- Are stored as `.ava` files in your project structure

### Key Features

#### 1. Agent Creation Interface

- **Visual folder tree**: Browse your project structure
- **Inline agent creation**: Click the `+` button on any folder
- **Template library**: Quick-start with pre-built agent templates
- **Rich configuration**: Define prompts, context, triggers, and scope

#### 2. Agent Configuration

**Prompt**: Define what the agent should do

``` txt
Review code changes for security vulnerabilities and best practices
```

**Context**: Additional information for the agent

``` txt
This API handles sensitive user data. All endpoints must be secured.
```

**Context Links**: Reference documentation

- OWASP API Security Guidelines
- Internal security policies
- Best practice guides

**MCP Servers**: Connect to Model Context Protocol servers

- `security-scanner`
- `code-quality`
- `coverage-reporter`

#### 3. Trigger Types

| Trigger | Description | Use Case |
|---------|-------------|----------|
| `on_commit` | Runs when code is committed | Code review, security scanning |
| `hourly` | Runs every hour | Monitoring, status checks |
| `daily` | Runs once per day | Reports, dependency updates |
| `on_change` | Runs when files change | Documentation updates, tests |
| `manual` | Triggered manually | Ad-hoc tasks, special operations |

#### 4. Scope Configuration

**All Files**: Agent applies to entire workspace

```json
{ "applyToAll": true }
```

**Specific Paths**: Target certain directories

```json
{ "includePaths": ["src/api/", "backend/"] }
```

**File Types**: Filter by extension

```json
{ "fileTypes": ["ts", "tsx", "js"] }
```

## Architecture

### New Packages

#### 1. `@ava/workflow-parser`

Parses CI/CD workflows (GitHub Actions, GitLab CI) into structured data.

**Key Features**:

- YAML to structured workflow parsing
- Dependency graph generation
- Workflow validation
- Agent type inference

**Usage**:

```typescript
import { GitHubActionsParser } from '@ava/workflow-parser';

const parser = new GitHubActionsParser();
const result = parser.parse(yamlContent, 'ci.yml');
const graph = parser.generateGraph(result.workflow);
```

#### 2. `@ava/ai-service`

AI translation service for YAML ↔ natural language conversion.

**Key Features**:

- YAML to English summaries
- English to YAML generation
- Agent explanation
- Workflow comparison
- Issue detection

**Usage**:

```typescript
import { WorkflowTranslator } from '@ava/ai-service';

const translator = new WorkflowTranslator({
  apiKey: process.env.OPENAI_API_KEY
});

const summary = await translator.yamlToEnglish(yamlContent);
const yaml = await translator.englishToYAML(description);
```

**Security Features**:

- Prompt injection prevention
- Content sandboxing
- Input validation
- Rate limiting support

### Updated Packages

#### `@ava/common-types`

New types for automation management:

- `Repository`: Git repository connections
- `Workflow`: CI/CD workflow definitions
- `Agent`: AI automation units
- `Trigger`: Execution triggers
- `AutomationInsight`: Analysis and recommendations

### Database Schema

New tables for agent management:

**`agents`**: Store agent definitions

```sql
- id, workspace_id, folder_path
- name, file_name
- prompt, context
- context_links, context_mcp_servers
- trigger_type, trigger_config
- scope
- enabled, owner_id
```

**`agent_executions`**: Track agent runs

```sql
- id, agent_id
- status, trigger_source
- input_data, output_data
- started_at, completed_at
```

**`agent_templates`**: Built-in templates

```sql
- name, description, category
- type, icon
- prompt_template, context_template
- default_trigger, default_scope
```

**Migration**: `infra/migrations/001_pivot_to_automations.sql`

## UI Components

### Folder Tree with Agents

**File**: `components/folder-tree-with-agents.tsx`

Features:

- Expandable folder structure
- Agent count badges
- Inline `+` button for agent creation
- Agent file indicators

### Agent Creator

**File**: `components/agent-creator.tsx`

Features:

- Name and prompt configuration
- Context input with rich formatting
- Dynamic link management (`+` button)
- MCP server connections
- Trigger selection
- Scope configuration (all/paths/types)
- Save and cancel actions

### Agent Card

**File**: `components/agent-card.tsx`

Displays:

- Agent name and type
- Status (enabled/disabled)
- Trigger configuration
- Prompt and context
- Links and MCP servers
- Scope details
- Action buttons (run, edit, delete, toggle)

### Agent Templates Panel

**File**: `components/agent-templates-panel.tsx`

Features:

- Categorized template library
- Template descriptions
- Quick-use buttons
- Category grouping

### Agent List Panel

**File**: `components/agent-list-panel.tsx`

Shows:

- Agents in selected folder
- Empty states with CTAs
- Bulk actions

## Sandbox Experience

### New Sandbox UI

**Layout**:

``` txt
┌─────────────────────────────────────────────────────┐
│ Header: Logo, Workspace, Templates, Theme          │
├──────────┬────────────────────────┬─────────────────┤
│          │                        │                 │
│  Folder  │   Agent Creator        │  Agent List    │
│  Tree    │   or                   │  or            │
│          │   Welcome Screen       │  Templates     │
│          │                        │                 │
├──────────┴────────────────────────┴─────────────────┤
│ Footer: Active agents summary                      │
└─────────────────────────────────────────────────────┘
```

**User Flow**:

1. Select folder from tree
2. Click `+` button or "Add Agent"
3. Define agent configuration:
   - Name
   - Prompt
   - Context
   - Links (with `+`)
   - MCP servers (with `+`)
   - Trigger type
   - Scope
4. Save agent (creates `.ava` file)
5. Agent appears in folder tree
6. View/edit/run agents from list

## Built-in Templates

1. **Code Reviewer** 🔍
   - Reviews commits for quality and security
   - Trigger: `on_commit`

2. **Security Scanner** 🔒
   - Scans for vulnerabilities
   - Trigger: `on_commit`

3. **Documentation Generator** 📚
   - Generates docs from code
   - Trigger: `on_change`

4. **Test Generator** 🧪
   - Creates unit tests
   - Trigger: `on_change`

5. **Slack Notifier** 💬
   - Sends deployment notifications
   - Trigger: `on_commit`

6. **Performance Monitor** ⚡
   - Analyzes performance impact
   - Trigger: `on_change`

7. **Dependency Updater** 📦
   - Checks for outdated packages
   - Trigger: `daily`

8. **Compliance Checker** ✅
   - Ensures regulatory compliance
   - Trigger: `on_commit`

## Demo Data

**File**: `lib/agent-demo-data.ts`

Includes:

- Sample folder structure
- 4 pre-configured agents
- Agent templates
- Realistic use cases

**Demo Agents**:

1. API Code Reviewer (backend/api)
2. Accessibility Checker (frontend/components)
3. Test Coverage Monitor (tests)
4. Deployment Notifier (root)

## Getting Started

### Run Sandbox

```bash
cd /Users/muhyadinmohamed/Documents/Development/ava
pnpm dev
```

Visit: **<http://localhost:3000/sandbox>**

### Create Your First Agent

1. Navigate to sandbox
2. Select a folder (e.g., `/backend`)
3. Click the `+` button
4. Fill in agent details:
   - **Name**: "API Security Scanner"
   - **Prompt**: "Check all API endpoints for security issues"
   - **Trigger**: `on_commit`
   - **Scope**: Specific paths → `backend/api/`
5. Click "Save Agent"

### Use a Template

1. Click "Templates" in header
2. Browse categories
3. Select template (e.g., "Code Reviewer")
4. Select target folder
5. Agent created automatically

## Environment Variables

```env
# Required for AI features
OPENAI_API_KEY=sk-...

# Database (Supabase)
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# Optional: GitHub integration (future)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## File Format: `.ava`

Agents are stored as structured files:

``` txt
{agentname}.ava
```

**Example**: `code-reviewer.ava`

Contains:

- Agent metadata (name, type, triggers)
- Prompt and context
- Configuration (links, MCP servers)
- Scope rules

## Workflow

### Development Mode (Current)

1. Create agents in UI
2. Agents stored in state
3. Manual execution via "Run" button

### Production Mode (Future)

1. Agents committed to `.ava` files
2. Synced to database
3. Triggered automatically based on configuration
4. Execution tracked in `agent_executions` table

## Next Steps

### Phase 1: Persistence

- [ ] Save agents to database
- [ ] Load agents from database
- [ ] `.ava` file generation

### Phase 2: Execution

- [ ] Agent execution engine
- [ ] Trigger monitoring
- [ ] Result tracking

### Phase 3: Integration

- [ ] GitHub OAuth
- [ ] Real repository scanning
- [ ] Webhook support

### Phase 4: AI Features

- [ ] OpenAI integration
- [ ] Natural language agent creation
- [ ] Smart suggestions

### Phase 5: Collaboration

- [ ] Team workspaces
- [ ] Agent sharing
- [ ] Execution history

## Technical Details

### State Management

**Zustand store**: `store/agent-store.ts`

State:

- `currentWorkspaceId`
- `folderTree`
- `agents`
- `selectedFolder`
- `selectedAgent`
- `isCreatingAgent`

Actions:

- `addAgent`, `updateAgent`, `deleteAgent`
- `setSelectedFolder`, `setSelectedAgent`
- `addFolder`

### Component Architecture

``` txt
sandbox/page.tsx
├── FolderTreeWithAgents (left)
├── AgentCreator or Welcome (center)
└── AgentListPanel or TemplatesPanel (right)
```

All components are client-side (`'use client'`) for interactivity.

## Security Considerations

### AI Service

- **Prompt injection prevention**: Content sandboxing with delimiters
- **Input validation**: Length limits, sanitization
- **Rate limiting**: API call throttling
- **Error handling**: No internal details exposed

### Database

- **RLS policies**: Workspace-based access control
- **Audit logging**: All agent operations tracked
- **Encrypted tokens**: OAuth tokens encrypted at rest

### Agent Execution

- **Scope enforcement**: Agents respect defined boundaries
- **Owner validation**: Only authorized users can modify
- **Execution limits**: Prevent infinite loops

## Troubleshooting

### Build Issues

```bash
# Rebuild all packages
pnpm -r build

# Check for type errors
pnpm --filter @ava/web build
```

### Development Server

```bash
# Start dev server
pnpm dev

# Clear Next.js cache
rm -rf apps/web/.next
```

### Database Migration

```bash
# Apply migration
psql -h localhost -U postgres -d ava -f infra/migrations/001_pivot_to_automations.sql
```

## Resources

- **Landing Page**: Preserved at `/`
- **Sandbox**: `/sandbox`
- **Documentation**: This file
- **Migration SQL**: `infra/migrations/001_pivot_to_automations.sql`

## Support

For issues or questions:

1. Check demo data for examples
2. Review built-in templates
3. Inspect component code
4. Check database schema

---

**Built with care for teams that value automation** ⚡

Ready to automate your workflow? Visit the sandbox at <http://localhost:3000/sandbox>
