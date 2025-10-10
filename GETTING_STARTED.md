# Getting Started with Ava

Welcome to Ava! This guide will help you set up and run the project locally.

## 📋 Prerequisites

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 8.0.0 (Install: `npm install -g pnpm`)
- **Git** (for version control)

## 🚀 Quick Start

### 1. Install Dependencies

From the project root:

```bash
pnpm install
```

This will install dependencies for all packages and apps in the monorepo.

### 2. Set Up Environment Variables

```bash
cd apps/web
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: For the sandbox demo, Supabase is optional. The app will work with demo data in client-side mode.

### 3. Start the Development Server

```bash
# From project root
pnpm web

# Or from apps/web directory
cd apps/web
pnpm dev
```

The app will be available at **<http://localhost:3000>**

### 4. Try the Sandbox

1. Navigate to <http://localhost:3000>
2. Click **"Try Sandbox Demo"**
3. Explore the compliance checking features!

## 🏗️ Project Structure

``` txt
ava/
├── apps/
│   └── web/              # Next.js web application
│       ├── app/          # Next.js App Router pages
│       ├── components/   # React components
│       ├── lib/          # Utilities and helpers
│       └── store/        # Zustand state management
│
├── packages/
│   ├── common-types/     # Shared TypeScript types
│   └── rules-engine/     # Core compliance rules engine
│
└── infra/
    ├── supabase-schema.sql      # Database schema
    └── SUPABASE_SETUP.md        # Supabase setup guide
```

## 🎯 Key Features to Explore

### Sandbox Mode (No Supabase Required)

The sandbox is a fully functional demo environment:

- **File Tree**: Browse a demo project structure
- **Compliance Checking**: See violations highlighted in real-time
- **Rule Templates**: Add new rules from built-in templates
- **Advisory Warnings**: Experience non-blocking compliance feedback

### Key Components

1. **File Tree Component** (`components/file-tree.tsx`)
   - Visual file browser with violation badges
   - Supports nested folders
   - Click to view file details

2. **Compliance Panel** (`components/compliance-panel.tsx`)
   - Lists all detected violations
   - Grouped by severity (error, warning, info)
   - Shows suggested fixes

3. **Rules Engine** (`packages/rules-engine`)
   - Validates filenames, paths, sizes, extensions
   - Configurable rules with templates
   - Advisory mode by default

## 🔧 Development Commands

```bash
# Install all dependencies
pnpm install

# Run web app
pnpm web

# Build all packages
pnpm build

# Run type checking
pnpm types:check

# Lint code
pnpm lint

# Clean all build artifacts
pnpm clean
```

## 📚 Next Steps

### For Product Exploration

1. ✅ Run the sandbox at <http://localhost:3000/sandbox>
2. Try adding different rule templates
3. Click files to see compliance violations
4. Explore the demo data structure

### For Development

1. **Set Up Supabase** (Optional for sandbox)
   - Follow `infra/SUPABASE_SETUP.md`
   - Create real workspaces and rules
   - Enable authentication

2. **Extend the Rules Engine**
   - Add custom rule types in `packages/rules-engine/src/checkers/`
   - Create new templates in `templates.ts`

3. **Build New Features**
   - Task management UI
   - Workspace creation flow
   - Real-time collaboration
   - Git integration

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is taken:

```bash
PORT=3001 pnpm web
```

### Dependency Issues

```bash
# Clean install
pnpm clean
rm -rf node_modules
pnpm install
```

### TypeScript Errors

```bash
# Build common-types package first
cd packages/common-types
pnpm build

# Then build rules-engine
cd ../rules-engine
pnpm build
```

### Cannot Find Module Errors

Make sure you've installed dependencies:

```bash
cd apps/web
pnpm install
```

## 📖 Additional Documentation

- **Supabase Setup**: See `infra/SUPABASE_SETUP.md`
- **Project README**: See main `README.md`
- **API Types**: Explore `packages/common-types/src/`

## 🎨 Customization

### Changing Theme Colors

Edit `apps/web/app/globals.css` to customize the Tailwind theme.

### Adding Rule Templates

Edit `packages/rules-engine/src/templates.ts` to add new built-in rules.

### Modifying Demo Data

Edit `apps/web/lib/demo-data.ts` to change the sandbox demo content.

## 🤝 Contributing

This is currently a private project. For questions or issues:

1. Check existing documentation
2. Review the code comments
3. Reach out to the project maintainer

## 🔒 Security Notes

- Never commit `.env.local` files
- Keep Supabase service role keys secret
- Use RLS policies for data access control
- Review security checklist before deploying

## 🚢 Deployment

### Web App (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Environment variables needed:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📞 Support

For help:

- Check the docs in `/infra` and project root
- Review code comments
- Test with the sandbox first

---

**Happy building with Ava!** 🎉
