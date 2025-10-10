# Development Guide

This guide covers development workflows, best practices, and architecture details for the Ava platform.

## 🏛️ Architecture Overview

### Monorepo Structure

Ava uses a **pnpm workspace** monorepo with the following structure:

``` txt
ava/
├── apps/           # Applications
├── packages/       # Shared packages
├── infra/          # Infrastructure & deployment
└── scripts/        # Build and utility scripts
```

### Package Dependencies

``` txt
@ava/web (Next.js app)
  ├─> @ava/common-types
  └─> @ava/rules-engine
        └─> @ava/common-types
```

All shared code lives in `packages/` and is referenced via workspace protocol (`workspace:*`).

## 🧩 Core Packages

### @ava/common-types

**Purpose**: Shared TypeScript types across all packages

**Key Files**:

- `workspace.ts` - Workspace and file tree types
- `rules.ts` - Rules and validation types
- `tasks.ts` - Task management types
- `users.ts` - User, team, and permissions types
- `audit.ts` - Audit logging types
- `compliance.ts` - Compliance reporting types

**Usage**:

```typescript
import { Workspace, Rule, Task } from '@ava/common-types';
```

### @ava/rules-engine

**Purpose**: Core compliance checking engine

**Architecture**:

``` txt
RulesEngine (orchestrator)
  ├─> FilenameChecker
  ├─> FilesizeChecker
  ├─> ExtensionChecker
  ├─> MetadataChecker
  └─> PathChecker
```

**Key Concepts**:

- **Checkers**: Individual rule validators
- **Rules**: Configuration for what to check
- **Violations**: Results of failed checks
- **Templates**: Pre-built rule configurations

**Adding a New Rule Type**:

1 Create checker in `packages/rules-engine/src/checkers/`:

```typescript
// my-custom-checker.ts
import { Rule, RuleViolation, FileNode } from '@ava/common-types';
import { RuleChecker } from '../engine';

export class MyCustomChecker implements RuleChecker {
  check(file: FileNode, rule: Rule): RuleViolation | null {
    // Your validation logic
    if (violationDetected) {
      return {
        id: generateViolationId(),
        ruleId: rule.id,
        fileNodeId: file.id,
        severity: rule.severity,
        message: 'Violation message',
        context: {
          filePath: file.path,
          suggestedFix: 'How to fix it',
        },
        detectedAt: new Date(),
      };
    }
    return null;
  }
}
```

2 Register in `engine.ts`:

```typescript
this.checkers.set('mycustom', new MyCustomChecker());
```

3 Update types in `common-types/src/rules.ts`:

```typescript
export type RuleType = 
  | 'filename'
  | 'mycustom'  // Add here
  | ...
```

### @ava/web

**Purpose**: Next.js 14 web application (sandbox MVP)

**Tech Stack**:

- Next.js 14 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query (data fetching)
- Zustand (state management)
- Supabase (backend)

**Key Directories**:

``` txt
apps/web/
├── app/                 # Next.js routes
│   ├── page.tsx        # Landing page
│   └── sandbox/        # Sandbox demo
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── file-tree.tsx
│   ├── compliance-panel.tsx
│   └── rule-templates-panel.tsx
├── lib/               # Utilities
│   ├── utils.ts       # General utilities
│   ├── supabase.ts    # Supabase client
│   └── demo-data.ts   # Sandbox demo data
└── store/             # Zustand stores
    └── workspace-store.ts
```

## 🎨 UI Components

We use a custom component library based on **shadcn/ui** patterns:

- `Button` - Primary interaction component
- `Card` - Content containers
- `Badge` - Status indicators
- `Input` - Form inputs

**Adding New Components**:

1. Create in `apps/web/components/ui/`
2. Follow existing patterns (CVA for variants)
3. Use `cn()` utility for class merging

## 🗄️ State Management

### Zustand Store Pattern

```typescript
// store/my-store.ts
import { create } from 'zustand';

interface MyState {
  data: DataType;
  setData: (data: DataType) => void;
}

export const useMyStore = create<MyState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));

// Usage in components
const { data, setData } = useMyStore();
```

### Current Stores

- `workspace-store.ts` - Workspace, files, rules, tasks state

## 🔄 Data Flow

### Sandbox Mode (Client-Side)

``` txt
Demo Data (lib/demo-data.ts)
  ↓
Zustand Store
  ↓
React Components
  ↓
Rules Engine (checking)
  ↓
Violations Display
```

### Production Mode (With Supabase)

``` txt
Supabase Database
  ↓
TanStack Query (fetching)
  ↓
Zustand Store (caching)
  ↓
React Components
  ↓
API Routes (mutations)
  ↓
Supabase Database
```

## 🧪 Testing Strategy

### Unit Tests (Rules Engine)

```bash
cd packages/rules-engine
pnpm test
```

Test checkers independently:

```typescript
// filename-checker.test.ts
import { FilenameChecker } from './filename-checker';

describe('FilenameChecker', () => {
  it('should detect invalid filenames', () => {
    const checker = new FilenameChecker();
    const violation = checker.check(mockFile, mockRule);
    expect(violation).not.toBeNull();
  });
});
```

### Integration Tests (Future)

- Test full rule checking pipeline
- Test API routes
- Test RLS policies

## 🚀 Performance Optimization

### Rules Engine

- Checkers run **synchronously** (fast for small file trees)
- For large trees: Consider Web Workers
- Cache results between checks

### React Components

- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to children
- Virtualize large file trees with `react-window`

### Database Queries

- Indexes already created for common queries
- Use Supabase query filters to limit data
- Implement pagination for large result sets

## 🔐 Security Best Practices

### Input Validation

Always validate user input:

```typescript
// Bad
const rule = { ...userInput };

// Good
const rule = RuleValidator.validateRule(userInput);
if (!rule.valid) {
  throw new Error(rule.errors.join(', '));
}
```

### RLS Policies

Test RLS policies thoroughly:

```sql
-- Test as specific user
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "user-id"}';

-- Try queries that should/shouldn't work
SELECT * FROM workspaces;
```

### Environment Variables

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client
- Use `NEXT_PUBLIC_` prefix only for safe values
- Validate env vars on startup

## 📦 Build Process

### Development Build

```bash
pnpm dev  # Parallel dev mode for all packages
```

### Production Build

```bash
pnpm build  # Build all packages in dependency order
```

Build order (automatic via pnpm):

1. `@ava/common-types`
2. `@ava/rules-engine`
3. `@ava/web`

## 🐛 Debugging Tips

### TypeScript Errors

1. Rebuild shared packages: `cd packages/common-types && pnpm build`
2. Restart TypeScript server in your IDE
3. Check for circular dependencies

### Rules Engine Not Working

1. Check rule configuration: `RuleValidator.validateRule(rule)`
2. Log checker output: `console.log(checker.check(file, rule))`
3. Verify rule scope matches files

### Supabase Connection Issues

1. Check env variables are loaded
2. Test with service role key (bypasses RLS)
3. Check Supabase logs in dashboard

## 📝 Code Style

### TypeScript

- Use explicit return types for functions
- Prefer interfaces over types for objects
- Use strict mode (already configured)

### React

- Prefer function components
- Use hooks consistently
- Extract complex logic to custom hooks

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Types: `kebab-case.ts`

## 🎯 Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes

- Update types in `common-types` if needed
- Implement logic in `rules-engine` or `web`
- Add tests

### 3. Test Locally

```bash
pnpm dev      # Start dev server
pnpm build    # Test production build
pnpm lint     # Check linting
```

### 4. Commit

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push & Deploy

```bash
git push origin feature/my-feature
```

## 🔄 Common Tasks

### Add a New Page

```bash
# Create route in app router
apps/web/app/my-page/page.tsx
```

### Add Dependency to Web App

```bash
cd apps/web
pnpm add package-name
```

### Update Shared Types

```bash
cd packages/common-types
# Edit src/...
pnpm build
# Changes automatically available in web app
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎉 Tips for Success

1. **Start with the Sandbox** - Understand the UX before building backend
2. **Type Everything** - TypeScript types catch bugs early
3. **Test Rules Locally** - Use demo data to iterate quickly
4. **Keep RLS Simple** - Complex policies are hard to debug
5. **Document As You Go** - Future you will thank you

---

Happy coding! 🚀
