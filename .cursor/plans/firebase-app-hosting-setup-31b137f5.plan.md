<!-- 31b137f5-6450-452a-9c4a-6d11ebf92a01 daefc075-9331-4c05-9b8b-1efb5be7a122 -->
# Firebase App Hosting Setup

## Context

Setting up Firebase App Hosting (optimized for Next.js) to deploy the web application while keeping Supabase for authentication.

## Configuration Files

### 1. Create `apps/web/firebase.json`

Configure Firebase App Hosting with Next.js settings:

- Set up hosting configuration for App Hosting
- Configure rewrites for Next.js API routes
- Set headers for security and caching
- Configure ignore patterns for deployment

### 2. Create `apps/web/.firebaserc`

Link to Firebase project:

- Add project ID placeholder
- Configure deployment targets if needed

### 3. Update `apps/web/.gitignore`

Add Firebase-specific entries:

- `.firebase/` cache directory
- `firebase-debug.log`
- `firestore-debug.log`

## Dependencies & Scripts

### 4. Update `apps/web/package.json`

Add Firebase deployment scripts:

- `firebase:deploy` - Deploy to Firebase App Hosting
- `firebase:preview` - Create preview deployment
- `firebase:login` - Authenticate with Firebase CLI

Note: Firebase CLI will be installed globally, not as project dependency

## Environment Variables

### 5. Create `apps/web/.env.production.example`

Document required environment variables for production:

- Existing Supabase variables
- Firebase configuration variables (if different from dev)
- Any production-specific settings

## Documentation

### 6. Update `apps/web/README.md`

Add Firebase deployment section:

- Prerequisites (Firebase CLI installation)
- Initial setup steps (firebase login, project linking)
- Deployment commands
- Environment variables configuration in Firebase console
- Troubleshooting common issues

## Key Implementation Details

**Firebase App Hosting Configuration:**

```json
{
  "hosting": {
    "source": ".",
    "ignore": ["firebase.json", "**/node_modules/**"],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}
```

**Deployment Flow:**

1. Run `pnpm build` to create production build
2. Firebase CLI deploys Next.js app with SSR support
3. Environment variables managed in Firebase Console
4. API routes, middleware, and Supabase auth continue to work

**Important Notes:**

- Supabase auth remains unchanged
- Middleware for route protection continues to work
- API routes are served by Firebase App Hosting
- Static assets optimized by Firebase CDN
- Need to set environment variables in Firebase Console after first deployment

### To-dos

- [ ] Create firebase.json with App Hosting configuration for Next.js
- [ ] Create .firebaserc with project ID placeholder
- [ ] Add Firebase cache and log files to .gitignore
- [ ] Add Firebase deployment scripts to package.json
- [ ] Create .env.production.example documenting required variables
- [ ] Add Firebase deployment instructions to README.md