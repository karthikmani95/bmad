# Supabase Backend Setup Guide

## Prerequisites
- Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details:
   - **Name**: notdfc-claims
   - **Database Password**: (choose a strong password)
   - **Region**: (select closest to you)
4. Wait for project to be created (~2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

3. Update `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://frbqcezztxvunsqggdbe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=yeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyYnFjZXp6dHh2dW5zcWdnZGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDA3NjMsImV4cCI6MjA4NjQ3Njc2M30.uqjuKKuYUYjUrupj0QPjwy0xmmFcV0Hr0i4MefvkkG0
```

## Step 3: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable email confirmations for demo:
   - Go to **Authentication** → **Settings**
   - Uncheck "Enable email confirmations"

## Step 4: Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy and paste contents of `supabase/migrations/20260212_initial_schema.sql`
4. Click **Run** to execute
5. Verify tables were created in **Table Editor**

## Step 5: Create Demo Users

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Create three users:

**User 1:**
- Email: `karthik.mani@kore.com`
- Password: `Demo@2026`
- Auto Confirm User: ✓

**User 2:**
- Email: `nandini.muthyala@kore.com`
- Password: `Demo@2026`
- Auto Confirm User: ✓

**User 3:**
- Email: `suman.chittimuri@kore.com`
- Password: `Demo@2026`
- Auto Confirm User: ✓

4. Copy each user's UUID (you'll need these for seeding data)

## Step 6: Seed Demo Data

1. Open `supabase/migrations/20260212_seed_data.sql`
2. Replace placeholders with actual user IDs:
   - Replace `USER_ID_1` with karthik.mani@kore.com's UUID
   - Replace `USER_ID_2` with nandini.muthyala@kore.com's UUID
   - Replace `USER_ID_3` with suman.chittimuri@kore.com's UUID
3. Go to **SQL Editor** in Supabase
4. Paste the updated SQL and click **Run**

## Step 7: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name: `claim-attachments`
4. Public: **No** (private)
5. Click **Create Bucket**

## Step 8: Set Storage Policies

1. Click on the `claim-attachments` bucket
2. Go to **Policies** tab
3. Click **New Policy** → **Create a policy from scratch**

**Upload Policy:**
```sql
CREATE POLICY "Users can upload claim attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'claim-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**View Policy:**
```sql
CREATE POLICY "Users can view own attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'claim-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Step 9: Test the Setup

1. Restart your Next.js dev server:
```bash
npm run dev
```

2. Go to http://localhost:3000
3. You should see a login page
4. Log in with one of the demo users
5. Verify you can see their transactions and claims

## Troubleshooting

### Can't see data after login
- Check that RLS policies are enabled
- Verify user IDs in seed data match actual user UUIDs
- Check browser console for errors

### File uploads not working
- Verify storage bucket is created
- Check storage policies are set correctly
- Ensure bucket is private (not public)

### Authentication errors
- Verify .env.local has correct Supabase URL and anon key
- Restart dev server after changing .env.local
- Check Supabase project is not paused

## Next Steps

After setup is complete:
1. Test creating a new claim
2. Upload files to a claim
3. Verify data persists across page refreshes
4. Test with all three demo users
