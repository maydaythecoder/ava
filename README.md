# Ava

Ava is a compliance-aware workspace and task management platform that helps teams maintain standards without blocking progress.

## 🎯 Core Value Proposition

- **Advisory, Not Blocking**: Ava warns about compliance issues without stopping work
- **Contextual Rules**: Apply different standards to different parts of your workspace
- **Smart Task Management**: Auto-generate subtasks and resolve conflicts with AI guidance
- **Sandbox Testing**: Test compliance rules risk-free before enabling enforcement

## 🏗️ Project Structure

This is a monorepo managed with pnpm workspaces:

``` txt
ava/
├── apps/
│   ├── web/          # Next.js web application (Sandbox MVP)
│   ├── electron/     # Desktop app (future)
│   └── cli/          # CLI tool (future)
├── packages/
│   ├── common-types/     # Shared TypeScript types
│   ├── rules-engine/     # Core compliance rules engine
│   ├── git-bridge/       # Git integration (future)
│   └── auth/            # Authentication utilities
├── infra/
│   ├── docker/          # Container configurations
│   └── terraform/       # Infrastructure as code
└── scripts/            # Build and deployment scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Run web app in development mode
pnpm web

# Run all apps in parallel
pnpm dev
```

## 📦 Packages

### @ava/common-types

Shared TypeScript types and interfaces used across all packages.

### @ava/rules-engine

Core rules engine for compliance checking:

- Regex-based filename validation
- Metadata checks
- Custom rule definitions
- Template library

### @ava/web

Next.js 14 web application - the core sandbox MVP.

## 🔒 Security Principles

1. **Never execute arbitrary terminal commands from web**
2. **Use Supabase RLS for data isolation**
3. **Audit log everything**
4. **Advisory language only** - no blocking errors

## 📈 Development Phases

- **Phase A**: Specification & Planning ✅
- **Phase B**: Core Web Sandbox MVP (Current)
- **Phase C**: Desktop Integration
- **Phase D**: Git Bridge & Real-time Sync

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth
- **State**: TanStack Query + Zustand
- **Deployment**: Vercel (web), Electron (desktop)

## 📝 License

Proprietary - All rights reserved
