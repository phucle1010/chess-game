# Database Setup Guide

This guide explains how to set up the database tables in Supabase.

## Method 1: Using Supabase Dashboard (Recommended)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar

### Step 2: Create a New Query

1. Click the **"New query"** button (top right)
2. You'll see a blank SQL editor

### Step 3: Copy and Paste the Migration SQL

1. Open the file `lib/supabase/migrations.sql` in this project
2. Copy **ALL** the contents of the file
3. Paste it into the Supabase SQL Editor

### Step 4: Run the SQL

1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the execution to complete
3. You should see a success message: "Success. No rows returned"

### Step 5: Verify Tables Were Created

1. Go to **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ `users`
   - ✅ `rooms`
   - ✅ `room_players`
   - ✅ `games`
   - ✅ `chat_messages`

## Method 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## What the Migration Does

The SQL migration creates:

1. **users** - User profiles with ratings and statistics
2. **rooms** - Game rooms where players can join
3. **room_players** - Junction table linking users to rooms
4. **games** - Chess game states and moves
5. **chat_messages** - Chat messages for each room

It also:

- Sets up indexes for better performance
- Enables Row Level Security (RLS)
- Creates RLS policies for data access
- Sets up triggers for automatic timestamp updates

## Troubleshooting

### Error: "relation already exists"

If you see this error, the tables might already exist. You can:

1. **Option A:** Drop existing tables first (⚠️ This will delete all data!)

   ```sql
   DROP TABLE IF EXISTS chat_messages CASCADE;
   DROP TABLE IF EXISTS games CASCADE;
   DROP TABLE IF EXISTS room_players CASCADE;
   DROP TABLE IF EXISTS rooms CASCADE;
   DROP TABLE IF EXISTS users CASCADE;
   ```

   Then run the migration again.

2. **Option B:** Use `CREATE TABLE IF NOT EXISTS` (already in the migration)

### Error: "permission denied"

Make sure you're running the SQL as the database owner or have proper permissions.

### Error: "function does not exist"

The migration creates functions. If you see this error, make sure you're running the **complete** migration file, not just parts of it.

## Verification Checklist

After running the migration, verify:

- [ ] All 5 tables exist in Table Editor
- [ ] RLS is enabled on all tables (check in Table Editor > Settings)
- [ ] Indexes are created (check in Database > Indexes)
- [ ] Functions exist (check in Database > Functions)

## Next Steps

After setting up the database:

1. ✅ Set up environment variables (`.env.local`)
2. ✅ Run `npm run dev`
3. ✅ Test user registration
4. ✅ Test creating a room
5. ✅ Test joining a room

## Need Help?

If you encounter issues:

1. Check the Supabase logs in the dashboard
2. Verify your Supabase project is active
3. Make sure you have the correct project URL and keys
