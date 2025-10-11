# Ava - AI Agent Management System

> **Transform your codebase into an intelligent, self-documenting automation platform**

Ava is a web-based Agent Management System that provides visibility and control over AI-powered automation agents in your repositories. It features a beautiful UI, GitHub integration, workflow visualization, and natural language automation explanations.

## 🎯 Vision

Ava shifts the paradigm from reactive compliance checking to proactive automation management. Instead of finding what's wrong, Ava helps you build and manage intelligent agents that understand your codebase, explain workflows in plain English, and execute automated tasks on your behalf.

## ✨ Features

### 🤖 Agent Management

- **Visual Agent Creator** - Intuitive UI for creating and configuring AI agents
- **Flexible Triggers** - Run agents on commit, schedule (hourly/daily), or file changes
- **Scoped Context** - Define specific paths and file types for agent focus
- **MCP Integration** - Connect to Model Context Protocol servers for enhanced capabilities
- **Template Library** - Pre-built agent templates for common use cases

### 🔗 GitHub Integration

- **OAuth Authentication** - Secure GitHub login
- **Repository Browser** - Access and manage your GitHub repositories
- **Workflow Parser** - Automatically parse GitHub Actions workflows
- **File Operations** - Create, update, and manage `.ava` agent files

### 🧠 AI-Powered Translation

- **YAML → English** - Convert complex workflows to human-readable explanations
- **English → YAML** - Generate workflows from natural language descriptions
- **OpenAI Integration** - Powered by GPT-4 for intelligent understanding

### 📊 Visualization & Insights

- **Interactive Workflow Diagrams** - D3.js-powered visualization of automation flows
- **Agent Metrics** - Track execution history, success rates, and performance
- **Real-time Dashboard** - Monitor all agents across your workspace

## 🏗️ Architecture

``` txt
ava/
├── packages/
│   ├── common-types/       # Shared TypeScript types
│   ├── workflow-parser/    # GitHub Actions YAML parser
│   ├── ai-service/         # OpenAI integration for translations
│   ├── git-bridge/         # GitHub OAuth & API client
│   └── rules-engine/       # Legacy compliance engine (deprecated)
├── apps/
│   └── web/               # Next.js frontend application
├── infra/
│   └── migrations/        # Database schema migrations
└── components/            # Shared React components
```

### Technology Stack

**Frontend:**

- Next.js 15 (App Router)
- React 19
- Tailwind CSS + Tailwind UI
- Headless UI
- Zustand (state management)
- D3.js + Recharts (visualization)

**Backend:**

- Next.js API Routes
- Supabase (PostgreSQL)
- GitHub REST API
- OpenAI API

**Infrastructure:**

- pnpm Monorepo
- TypeScript
- ESLint
- Vercel (deployment)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- GitHub account
- OpenAI API key
- Supabase project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ava.git
   cd ava
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in `apps/web/`:

   ```env
   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3001
   ```

4. **Set up GitHub OAuth App**
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3001/api/auth/github/callback`
   - Copy Client ID and Secret to `.env.local`

5. **Run database migrations**

   ```bash
   # In your Supabase SQL Editor, run:
   # infra/migrations/001_pivot_to_automations.sql
   ```

6. **Start development server**

   ```bash
   pnpm dev
   ```

7. **Open the app**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📖 Usage

### Creating an Agent

1. **Navigate to Sandbox** - Click on "Sandbox" in the main navigation
2. **Select a Folder** - Click a folder in the left sidebar
3. **Click "Add Agent"** - Use the + button that appears
4. **Configure Agent:**
   - Enter a name and description
   - Define the agent's prompt/instructions
   - Add context links (documentation, APIs, etc.)
   - Connect MCP servers if needed
   - Set trigger conditions (commit, schedule, file change)
   - Define scope (specific paths and file types)
5. **Save** - Agent is created as `{agentname}.ava` in the selected folder

### Visualizing Workflows

1. **Connect GitHub** - Authenticate via GitHub OAuth
2. **Select Repository** - Choose from your repositories
3. **View Workflows** - See parsed GitHub Actions workflows
4. **Interactive Diagram** - Explore workflow structure visually
5. **Translate to English** - Get human-readable explanations

### Managing Agents

- **View All Agents** - See agents in the right sidebar
- **Edit Agent** - Click to modify configuration
- **View Metrics** - Track execution history and performance
- **Delete Agent** - Remove agents you no longer need

## 🧩 Package Overview

### `@ava/common-types`

Shared TypeScript definitions for:

- Repositories, Workflows, Agents
- Agent triggers, scopes, and execution types
- User authentication and audit trails

### `@ava/workflow-parser`

Parses GitHub Actions YAML files into structured data:

- Workflow metadata (name, triggers)
- Job definitions and dependencies
- Step configurations and actions

### `@ava/ai-service`

OpenAI integration for intelligent translations:

- YAML to natural language
- Natural language to YAML
- Customizable prompt templates

### `@ava/git-bridge`

GitHub integration layer:

- OAuth authentication flow
- Repository and file operations
- Workflow file fetching
- Tree traversal

## 🗄️ Database Schema

The system uses PostgreSQL (via Supabase) with the following main tables:

- **`repositories`** - Connected GitHub repositories
- **`workflows`** - Parsed workflow definitions
- **`agents`** - AI agent configurations
- **`agent_executions`** - Execution history and logs
- **`agent_templates`** - Reusable agent templates

See `infra/migrations/001_pivot_to_automations.sql` for the complete schema.

## 🔒 Security

- **OAuth 2.0** - Secure GitHub authentication
- **HTTP-only Cookies** - Token storage (encrypt in production!)
- **CSRF Protection** - State parameter validation
- **Row Level Security** - Supabase RLS policies
- **API Key Management** - Environment variable isolation

## 🚧 Roadmap

- [x] Core agent management system
- [x] GitHub OAuth integration
- [x] Workflow parser and visualizer
- [x] AI-powered translations
- [x] Tailwind UI design system
- [ ] Real-time agent execution
- [ ] Multi-repository support
- [ ] Agent marketplace
- [ ] Webhook integrations
- [ ] VSCode extension
- [ ] Slack/Discord notifications

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Tailwind UI](https://tailwindcss.com/plus) - Beautiful UI components
- [Headless UI](https://headlessui.com/) - Unstyled accessible components
- [Heroicons](https://heroicons.com/) - Icon system
- [D3.js](https://d3js.org/) - Data visualization
- [OpenAI](https://openai.com/) - AI capabilities
- [Supabase](https://supabase.com/) - Backend infrastructure

---

Built with ❤️ by the Ava team
