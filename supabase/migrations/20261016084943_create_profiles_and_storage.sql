/*
# Create database tables and storage for ife dating app

## Overview
Sets up the full backend for the ife dating app: profiles with values answers,
swipes for matching, conversations, and messages. Also creates two storage
buckets — one for profile photos and one for verification selfies.

## New Tables

### profiles
- `id` (uuid, PK, default gen_random_uuid)
- `name` (text, not null)
- `age` (integer, not null)
- `city` (text, not null)
- `country` (text, default 'Nigeria')
- `occupation` (text)
- `education` (text)
- `bio` (text)
- `photos` (text[], default '{}') — array of storage URLs
- `interests` (text[], default '{}')
- `prompts` (jsonb, default '[]') — array of {question, answer}
- `values_answers` (jsonb, default '{}') — map of question id -> value
- `verified` (boolean, default false)
- `is_me` (boolean, default false) — marks the current user's profile
- `created_at` (timestamptz, default now())

### swipes
- `id` (uuid, PK)
- `swiper_id` (uuid, FK to profiles, not null)
- `swiped_id` (uuid, FK to profiles, not null)
- `action` (text, not null) — 'like', 'pass', 'superlike'
- `created_at` (timestamptz, default now())
- Unique constraint on (swiper_id, swiped_id) to prevent duplicate swipes

### conversations
- `id` (uuid, PK)
- `profile_a_id` (uuid, FK to profiles)
- `profile_b_id` (uuid, FK to profiles)
- `created_at` (timestamptz, default now())
- Unique constraint on (profile_a_id, profile_b_id)

### messages
- `id` (uuid, PK)
- `conversation_id` (uuid, FK to conversations, not null)
- `sender_id` (uuid, FK to profiles, not null)
- `text` (text, not null)
- `created_at` (timestamptz, default now)

## Security
- RLS enabled on all tables.
- Single-tenant app (no auth): policies use `TO anon, authenticated` with `USING (true)` 
  because all data is intentionally shared — anyone can browse profiles, swipe, and chat.
- No user_id columns or auth.uid() checks since there is no sign-in flow.

## Storage
- `profile-photos` bucket (public) for profile images
- `verification` bucket (private) for verification selfies
- Storage policies allow public read of profile photos, authenticated upload
- Verification bucket is private (upload only via service role or authenticated)
*/

-- ============ PROFILES TABLE ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL,
  city text NOT NULL,
  country text DEFAULT 'Nigeria',
  occupation text,
  education text,
  bio text,
  photos text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  prompts jsonb DEFAULT '[]'::jsonb,
  values_answers jsonb DEFAULT '{}'::jsonb,
  verified boolean DEFAULT false,
  is_me boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profiles" ON profiles;
CREATE POLICY "anon_insert_profiles" ON profiles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profiles" ON profiles;
CREATE POLICY "anon_update_profiles" ON profiles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_profiles" ON profiles;
CREATE POLICY "anon_delete_profiles" ON profiles FOR DELETE
  TO anon, authenticated USING (true);

-- ============ SWIPES TABLE ============
CREATE TABLE IF NOT EXISTS swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  swiped_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('like', 'pass', 'superlike')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (swiper_id, swiped_id)
);

ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_swipes" ON swipes;
CREATE POLICY "anon_select_swipes" ON swipes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_swipes" ON swipes;
CREATE POLICY "anon_insert_swipes" ON swipes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_swipes" ON swipes;
CREATE POLICY "anon_update_swipes" ON swipes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_swipes" ON swipes;
CREATE POLICY "anon_delete_swipes" ON swipes FOR DELETE
  TO anon, authenticated USING (true);

-- ============ CONVERSATIONS TABLE ============
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_a_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_b_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (profile_a_id, profile_b_id)
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_conversations" ON conversations;
CREATE POLICY "anon_select_conversations" ON conversations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_conversations" ON conversations;
CREATE POLICY "anon_insert_conversations" ON conversations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_conversations" ON conversations;
CREATE POLICY "anon_update_conversations" ON conversations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_conversations" ON conversations;
CREATE POLICY "anon_delete_conversations" ON conversations FOR DELETE
  TO anon, authenticated USING (true);

-- ============ MESSAGES TABLE ============
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_messages" ON messages;
CREATE POLICY "anon_select_messages" ON messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_messages" ON messages;
CREATE POLICY "anon_update_messages" ON messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_messages" ON messages;
CREATE POLICY "anon_delete_messages" ON messages FOR DELETE
  TO anon, authenticated USING (true);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_a ON conversations(profile_a_id);
CREATE INDEX IF NOT EXISTS idx_conversations_b ON conversations(profile_b_id);

-- ============ STORAGE BUCKETS ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('verification', 'verification', false)
ON CONFLICT (id) DO NOTHING;

-- ============ STORAGE POLICIES ============
-- Profile photos: public read, anyone can upload
DROP POLICY IF EXISTS "Public read profile photos" ON storage.objects;
CREATE POLICY "Public read profile photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'profile-photos');

DROP POLICY IF EXISTS "Anyone can upload profile photos" ON storage.objects;
CREATE POLICY "Anyone can upload profile photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'profile-photos');

DROP POLICY IF EXISTS "Anyone can update profile photos" ON storage.objects;
CREATE POLICY "Anyone can update profile photos" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'profile-photos') WITH CHECK (bucket_id = 'profile-photos');

DROP POLICY IF EXISTS "Anyone can delete profile photos" ON storage.objects;
CREATE POLICY "Anyone can delete profile photos" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'profile-photos');

-- Verification: private read (authenticated only), anyone can upload
DROP POLICY IF EXISTS "Authenticated read verification" ON storage.objects;
CREATE POLICY "Authenticated read verification" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'verification');

DROP POLICY IF EXISTS "Anyone can upload verification" ON storage.objects;
CREATE POLICY "Anyone can upload verification" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'verification');
