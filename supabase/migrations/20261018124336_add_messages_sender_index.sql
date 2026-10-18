-- Add missing index on messages.sender_id for FK performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);