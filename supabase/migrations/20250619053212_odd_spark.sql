/*
  # Add missing columns to whatsapp_customers table

  1. New Columns
    - `last_message_at` (timestamptz) - Timestamp of the last message
    - `last_message` (text) - Content of the last message
    - `conversation_status` (text) - Status of the conversation (active, inactive, etc.)

  2. Security
    - No changes to existing RLS policies needed
*/

-- Add missing columns to whatsapp_customers table
DO $$
BEGIN
  -- Add last_message_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'last_message_at'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN last_message_at timestamptz;
  END IF;

  -- Add last_message column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'last_message'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN last_message text;
  END IF;

  -- Add conversation_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'conversation_status'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN conversation_status text DEFAULT 'inactive';
  END IF;
END $$;