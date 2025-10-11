# Firebase App Hosting Deployment Guide

## Monorepo Configuration

This project uses a pnpm monorepo structure with the Next.js web app in `apps/web`. Firebase App Hosting requires special configuration to work with this structure.

### Setup

The following symlinks are created at the root to make Firebase App Hosting recognize this as a Next.js app while maintaining workspace context:

```
app -> apps/web/app
components -> apps/web/components
lib -> apps/web/lib
middleware.ts -> apps/web/middleware.ts
next.config.ts -> apps/web/next.config.ts
next-env.d.ts -> apps/web/next-env.d.ts
postcss.config.mjs -> apps/web/postcss.config.mjs
public -> apps/web/public
store -> apps/web/store
tailwind.config.ts -> apps/web/tailwind.config.ts
tsconfig.json -> apps/web/tsconfig.json
types -> apps/web/types
```

### Build Process

The root `package.json` has been configured with:
- `build`: Builds workspace dependencies first, then the web app
- `start`: Runs the Next.js server from `apps/web`

Firebase will execute:
1. `pnpm install` - Installs all dependencies and sets up workspace links
2. `pnpm build` - Builds workspace packages and Next.js app
3. `pnpm start` - Starts the Next.js production server

### Environment Variables

All environment variables are configured in `apphosting.yaml` at the root:
- Supabase configuration (public keys)
- Firebase configuration (public keys)

### Deployment

To deploy:

```bash
firebase deploy
```

To delete and recreate a backend:

```bash
firebase apphosting:backends:delete <backend-name>
firebase deploy
```

### Troubleshooting

**Build Fails:**
- Check Cloud Build logs at: https://console.cloud.google.com/cloud-build/builds
- Verify all workspace packages build successfully locally: `pnpm build`
- Ensure symlinks are committed to git

**Module Not Found Errors:**
- Verify workspace dependencies are listed in `apps/web/package.json`
- Check that `transpilePackages` in `next.config.ts` includes all workspace packages
- Ensure `prebuild` script in `apps/web/package.json` builds dependencies

**Runtime Errors:**
- Verify environment variables in `apphosting.yaml`
- Check Cloud Run logs in Firebase Console
