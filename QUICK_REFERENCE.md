# Ava - Quick Reference Card

## 🚀 Essential Commands

```bash
# Start everything
pnpm install          # Install all dependencies
pnpm build           # Build all packages
pnpm web             # Start web app (localhost:3000)

# Individual packages
cd packages/common-types && pnpm build
cd packages/rules-engine && pnpm build
cd apps/web && pnpm dev

# Clean slate
pnpm clean           # Remove all build artifacts
rm -rf node_modules  # Fresh install if needed
```

## 📁 Key Files & Locations

### Configuration

- `/package.json` - Root workspace config
- `/pnpm-workspace.yaml` - Workspace packages
- `/apps/web/.env.local` - Environment variables (create from .env.local.example)

### Core Packages

- `/packages/common-types/src/` - All TypeScript types
- `/packages/rules-engine/src/` - Compliance engine
- `/packages/rules-engine/src/templates.ts` - Rule templates

### Web App

- `/apps/web/app/page.tsx` - Landing page
- `/apps/web/app/sandbox/page.tsx` - Sandbox demo
- `/apps/web/components/` - React components
- `/apps/web/lib/demo-data.ts` - Demo data

### Documentation

- `/README.md` - Project overview
- `/GETTING_STARTED.md` - Setup guide
- `/DEVELOPMENT.md` - Developer docs
- `/PROJECT_SUMMARY.md` - What's been built

## 🎯 URLs

- **Landing**: <http://localhost:3000>
- **Sandbox**: <http://localhost:3000/sandbox>

## 🔧 Common Tasks

### Add a Rule Template

Edit: `packages/rules-engine/src/templates.ts`

```typescript
{
  id: 'my-rule',
  name: 'My Rule',
  type: 'filename',
  config: { pattern: '^[a-z]+$' },
  // ...
}
```

### Customize Demo Data

Edit: `apps/web/lib/demo-data.ts`

```typescript
export function createDemoFileTree(): FileTreeNode {
  // Add your files here
}
```

### Add a UI Component

Create: `apps/web/components/ui/my-component.tsx`

```typescript
export function MyComponent() {
  return <div>Hello</div>;
}
```

### Add a New Page

Create: `apps/web/app/my-page/page.tsx`

```typescript
export default function MyPage() {
  return <div>My Page</div>;
}
```

## 📦 Package Structure

``` txt
@ava/web           → Web application
  ↓ depends on
@ava/rules-engine  → Compliance checking
  ↓ depends on
@ava/common-types  → Shared types
```

## 🐛 Troubleshooting

### "Cannot find module '@ava/...'"

```bash
cd packages/common-types && pnpm build
cd packages/rules-engine && pnpm build
```

### "Port 3000 already in use"

```bash
PORT=3001 pnpm web
```

### TypeScript errors

```bash
# Rebuild packages
pnpm build
# Restart IDE TypeScript server
```

### Fresh start

```bash
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

## 🎨 Tech Stack Quick Ref

| Technology | Purpose | Docs |
|------------|---------|------|
| Next.js 14 | Web framework | [nextjs.org](https://nextjs.org) |
| React 19 | UI library | [react.dev](https://react.dev) |
| TypeScript | Type safety | [typescriptlang.org](https://typescriptlang.org) |
| Tailwind CSS | Styling | [tailwindcss.com](https://tailwindcss.com) |
| Supabase | Backend | [supabase.com](https://supabase.com) |
| Zustand | State | [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) |
| TanStack Query | Data fetching | [tanstack.com/query](https://tanstack.com/query) |

## 🔑 Key Concepts

### Advisory Mode

Rules **warn** but don't **block**. Users decide when to fix issues.

### Rule Scope

Rules can target:

- Specific paths (`/src/components`)
- File types (`.tsx`, `.ts`)
- Custom conditions

### Violations

Each violation includes:

- Severity (error/warning/info)
- Message (what's wrong)
- Context (where it is)
- Suggested fix (how to resolve)

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add env vars
4. Deploy!

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📊 Project Stats

- **Packages**: 3
- **Components**: 8+
- **Type Definitions**: 200+
- **Rule Templates**: 9
- **Lines of Code**: 5,000+

## 🎓 Learning Path

1. **Start**: Try sandbox at `/sandbox`
2. **Explore**: Look at demo data
3. **Customize**: Change templates
4. **Build**: Add features
5. **Deploy**: Go live!

## 💡 Pro Tips

- Use sandbox for rapid testing (no DB needed)
- Build packages after changing types
- Check browser console for debugging
- Use TypeScript errors as guides
- Read inline code comments

## 📞 Getting Help

1. Check `GETTING_STARTED.md`
2. Review `DEVELOPMENT.md`
3. Look at code examples
4. Test in sandbox first

## ✅ Quick Health Check

```bash
# All should pass
pnpm install    # ✓ Dependencies installed
pnpm build      # ✓ All packages build
pnpm web        # ✓ Server starts
# Open http://localhost:3000/sandbox
# ✓ Sandbox loads
# ✓ File tree displays
# ✓ Rules apply
# ✓ Violations show
```

---

**Keep this handy!** Bookmark or print for quick reference.
