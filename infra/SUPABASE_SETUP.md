# Supabase Setup Guide

This guide walks you through setting up Supabase for the Ava platform.

## Prerequisites

- A Supabase account (sign up at <https://supabase.com>)
- Node.js >= 18.0.0

## Step 1: Create a Supabase Project

1. Go to <https://app.supabase.com>
2. Click "New Project"
3. Fill in:
   - **Name**: `ava-platform` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier works for development

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, navigate to the **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `infra/supabase-schema.sql`
4. Click "Run" to execute the schema

This will create:

- All necessary tables (users, workspaces, file_nodes, rules, tasks, etc.)
- Indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp triggers

## Step 3: Configure Environment Variables

1 In your Supabase project dashboard, go to **Settings** > **API**
2 Copy the following values:

- **Project URL** (under "Project API")
- **anon/public key** (under "Project API keys")
- **service_role key** (for backend operations only)

3 In your web app, create `.env.local`:

```bash
cd apps/web
cp .env.local.example .env.local
```

4 Update `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Set Up Authentication

### Email/Password Auth (Default)

Email authentication is enabled by default in Supabase.

### OAuth Providers (Optional)

To enable social login:

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable desired providers (GitHub, Google, etc.)
3. Follow provider-specific setup instructions
4. Update redirect URLs to include your app's domain

### Development URLs

Add these authorized redirect URLs in **Authentication** > **URL Configuration**:

``` txt
http://localhost:3000
http://localhost:3000/auth/callback
```

## Step 5: Test the Connection

Run the web app to test the connection:

```bash
cd apps/web
pnpm install
pnpm dev
```

Visit <http://localhost:3000> - the app should load without database errors.

## Step 6: Seed Demo Data (Optional)

For development/testing, you can seed the database with demo data:

```sql
-- Insert a demo user (run in SQL Editor)
INSERT INTO public.users (id, email, name, role)
VALUES (
  auth.uid(), -- Use your authenticated user ID
  'demo@example.com',
  'Demo User',
  'admin'
);

-- The sandbox page uses client-side demo data,
-- but you can populate real data here if needed
```

## Security Considerations

### Row Level Security (RLS)

RLS is enabled on all tables. The policies ensure:

- Users can only access workspaces they own or their teams have access to
- Users can only read their own profile and audit logs
- All data access is scoped to authenticated users

### API Keys

- **Anon Key**: Safe to use in client-side code (respects RLS)
- **Service Role Key**: NEVER expose in client code (bypasses RLS)
  - Only use in secure server-side code
  - Store in environment variables
  - Never commit to version control

### Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Review and test all RLS policies
- [ ] Configure rate limiting
- [ ] Set up custom domain
- [ ] Enable SSL/TLS
- [ ] Configure CORS properly
- [ ] Set up error logging (Sentry, etc.)

## Troubleshooting

### Connection Issues

If you can't connect to Supabase:

1. Verify environment variables are correct
2. Check that RLS policies aren't blocking access
3. Ensure your IP isn't blocked (check Supabase dashboard)
4. Try using the service role key temporarily to debug

### RLS Policy Issues

To debug RLS:

1. Temporarily disable RLS on a table:

   ```sql
   ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;
   ```

2. Test if the issue resolves
3. Review policy logic
4. Re-enable RLS before deploying

### Performance Issues

If queries are slow:

1. Check the indexes are created (run schema again if needed)
2. Use the Supabase dashboard to view slow queries
3. Consider adding indexes for frequently queried columns
4. Review and optimize complex RLS policies

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For issues specific to Ava:

- Check the main README.md
- Review this setup guide
- Open an issue in the repository

For Supabase-specific issues:

- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Supabase Discord](https://discord.supabase.com)
