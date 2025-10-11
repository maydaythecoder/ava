# Supabase Auth Setup Guide

This guide walks you through configuring Supabase Auth for the AVA application.

## Prerequisites

- Supabase project created at <https://supabase.com>
- Project URL and anon key added to `apps/web/.env.local`

## Environment Variables

Ensure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gkzzuaotffudipbpqukr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase Dashboard Configuration

### 1. Enable Email Authentication

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Find **Email** provider and enable it
3. Configure email settings:
   - **Enable Email Confirmations**: Recommended for production
   - **Secure Email Change**: Enable for additional security
   - **Disable Sign-ups**: Optional (if you want invite-only)

### 2. Configure Email Templates (Optional)

Customize email templates under **Authentication** > **Email Templates**:

- Confirmation email
- Magic link email
- Password reset email
- Email change confirmation

### 3. Enable GitHub OAuth (Optional)

1. Create a GitHub OAuth App:
   - Go to <https://github.com/settings/developers>
   - Click "New OAuth App"
   - **Application name**: AVA (or your app name)
   - **Homepage URL**: `http://localhost:3000` (dev) or your production URL
   - **Authorization callback URL**: `https://gkzzuaotffudipbpqukr.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and generate a **Client Secret**

2. Configure GitHub in Supabase:
   - Go to **Authentication** > **Providers**
   - Find **GitHub** and enable it
   - Enter your GitHub **Client ID** and **Client Secret**
   - Save changes

### 4. Configure Redirect URLs

Under **Authentication** > **URL Configuration**:

**Site URL**: `http://localhost:3000` (dev) or your production URL

**Redirect URLs** (add these):

- `http://localhost:3000/api/auth/callback`
- `http://localhost:3000/**` (allows all paths)
- Add your production URLs when deploying

### 5. Configure Email Rate Limiting (Production)

Under **Authentication** > **Rate Limits**:

- Configure appropriate rate limits to prevent abuse
- Recommended: 4-6 emails per hour per user

## Testing the Setup

### 1. Email/Password Authentication

```bash
# Start the dev server
cd apps/web
pnpm dev
```

Visit <http://localhost:3000/signup> and create an account.

**Development Note**: In development, Supabase may not send actual emails. Check the Supabase logs:

- Go to **Authentication** > **Users** to see registered users
- For magic links, check the **Logs** section for the actual link

### 2. GitHub OAuth

1. Visit <http://localhost:3000/login>
2. Click "GitHub" button
3. Authorize the application
4. You should be redirected to `/sandbox`

### 3. Password Reset Flow

1. Visit <http://localhost:3000/forgot-password>
2. Enter your email
3. Check email for reset link (or Supabase logs in dev)
4. Click link to reset password

## Security Considerations

### Production Checklist

- [ ] Enable email confirmations
- [ ] Configure proper rate limiting
- [ ] Set production Site URL and Redirect URLs
- [ ] Use HTTPS for all URLs
- [ ] Enable RLS (Row Level Security) policies on your tables
- [ ] Configure SMTP settings for production emails
- [ ] Enable MFA (Multi-Factor Authentication) if needed
- [ ] Set up monitoring and alerts

### Row Level Security (RLS)

When you create tables in Supabase, always enable RLS and create appropriate policies:

```sql
-- Example: User-specific data table
CREATE TABLE user_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_workspaces ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own workspaces
CREATE POLICY "Users can view own workspaces"
  ON user_workspaces
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own workspaces
CREATE POLICY "Users can create own workspaces"
  ON user_workspaces
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Troubleshooting

### Issue: "Invalid redirect URL"

**Solution**: Make sure the callback URL is added to the Redirect URLs in Supabase dashboard.

### Issue: Not receiving emails in development

**Solution**: Check Supabase logs under **Logs** > **Auth**. The magic link/reset link will be logged there.

### Issue: "User already registered"

**Solution**: Check **Authentication** > **Users** to see existing users. Delete test users if needed.

### Issue: GitHub OAuth not working

**Solution**:

1. Verify callback URL in GitHub OAuth app matches: `https://gkzzuaotffudipbpqukr.supabase.co/auth/v1/callback`
2. Check Client ID and Secret are correctly entered in Supabase
3. Ensure GitHub OAuth app is not suspended

## Next Steps

1. **Create Database Tables**: Define your schema in Supabase
2. **Generate TypeScript Types**: Run `npx supabase gen types typescript --project-id gkzzuaotffudipbpqukr > apps/web/types/supabase.ts`
3. **Implement RLS Policies**: Secure your tables with Row Level Security
4. **Add User Profile Management**: Create UI for updating user profiles
5. **Set Up Production Environment**: Configure production URLs and SMTP

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
