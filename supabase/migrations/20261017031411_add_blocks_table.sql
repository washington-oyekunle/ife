/*
# Add blocks table for block/report feature

## Overview
Adds a `blocks` table so users can block or report other profiles.
Blocked profiles are filtered out of the discover feed.

## New Tables

### blocks
- `id` (uuid, PK, default gen_random_uuid)
- `blocker_id` (uuid, FK to profiles, not null) — who blocked
- `blocked_id` (uuid, FK to profiles, not null) — who was blocked
- `reason` (text, nullable) — optional report reason
- `created_at` (timestamptz, default now())
- Unique constraint on (blocker_id, blocked_id)

## Security
- RLS enabled on blocks.
- Single-tenant app: `TO anon, authenticated` with `USING (true)` since data is shared.
*/

CREATE TABLE IF NOT EXISTS blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_blocks" ON blocks;
CREATE POLICY "anon_select_blocks" ON blocks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_blocks" ON blocks;
CREATE POLICY "anon_insert_blocks" ON blocks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_blocks" ON blocks;
CREATE POLICY "anon_update_blocks" ON blocks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_blocks" ON blocks;
CREATE POLICY "anon_delete_blocks" ON blocks FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON blocks(blocked_id);
