/*
  # Fix missing columns in WhatsApp tables
  
  1. Add missing columns to whatsapp_customers table
    - `last_message_at` (timestamptz) - Timestamp of the last message
    - `last_message` (text) - Content of the last message
    - `conversation_status` (text) - Status of the conversation (active, inactive)
    - `metadata` (jsonb) - Additional metadata for the customer
  
  2. Add missing columns to whatsapp_messages table
    - `timestamp` (timestamptz) - Timestamp of the message
    - `message_type` (text) - Type of message (text, image, etc.)
    - `sender_id` (text) - ID of the sender
    - `status` (text) - Status of the message (sent, delivered, read)
    - `metadata` (jsonb) - Additional metadata for the message
    - `updated_at` (timestamptz) - Last update timestamp
  
  3. Create whatsapp_statuses table if it doesn't exist
    - For storing status updates from customers
  
  4. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
  
  5. Performance
    - Add indexes for commonly queried columns
*/

-- Create whatsapp_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS whatsapp_customers (
  id SERIAL PRIMARY KEY,
  wa_id text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  name text,
  profile_name text,
  status text DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

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
  
  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Create whatsapp_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id SERIAL PRIMARY KEY,
  conversation_id text NOT NULL,
  wa_id text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns to whatsapp_messages table
DO $$
BEGIN
  -- Add timestamp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_messages' AND column_name = 'timestamp'
  ) THEN
    ALTER TABLE whatsapp_messages ADD COLUMN timestamp timestamptz DEFAULT now();
  END IF;

  -- Add message_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE whatsapp_messages ADD COLUMN message_type text DEFAULT 'text';
  END IF;

  -- Add sender_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_messages' AND column_name = 'sender_id'
  ) THEN
    ALTER TABLE whatsapp_messages ADD COLUMN sender_id text;
  END IF;

  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_messages' AND column_name = 'status'
  ) THEN
    ALTER TABLE whatsapp_messages ADD COLUMN status text DEFAULT 'sent';
  END IF;

  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_messages' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE whatsapp_messages ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Create whatsapp_statuses table if it doesn't exist
CREATE TABLE IF NOT EXISTS whatsapp_statuses (
  id SERIAL PRIMARY KEY,
  wa_id text NOT NULL,
  status_type text NOT NULL,
  status_data jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE whatsapp_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_statuses ENABLE ROW LEVEL SECURITY;

-- Create policies for whatsapp_customers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_customers' AND policyname = 'Users can read all customers'
  ) THEN
    CREATE POLICY "Users can read all customers"
      ON whatsapp_customers
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_customers' AND policyname = 'Users can insert customers'
  ) THEN
    CREATE POLICY "Users can insert customers"
      ON whatsapp_customers
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_customers' AND policyname = 'Users can update customers'
  ) THEN
    CREATE POLICY "Users can update customers"
      ON whatsapp_customers
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for whatsapp_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_messages' AND policyname = 'Users can read all messages'
  ) THEN
    CREATE POLICY "Users can read all messages"
      ON whatsapp_messages
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_messages' AND policyname = 'Users can insert messages'
  ) THEN
    CREATE POLICY "Users can insert messages"
      ON whatsapp_messages
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_messages' AND policyname = 'Users can update messages'
  ) THEN
    CREATE POLICY "Users can update messages"
      ON whatsapp_messages
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create policies for whatsapp_statuses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_statuses' AND policyname = 'Users can read all statuses'
  ) THEN
    CREATE POLICY "Users can read all statuses"
      ON whatsapp_statuses
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_statuses' AND policyname = 'Users can insert statuses'
  ) THEN
    CREATE POLICY "Users can insert statuses"
      ON whatsapp_statuses
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'whatsapp_statuses' AND policyname = 'Users can update statuses'
  ) THEN
    CREATE POLICY "Users can update statuses"
      ON whatsapp_statuses
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_customers_last_message_at 
  ON whatsapp_customers(created_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_timestamp 
  ON whatsapp_messages(created_at ASC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_wa_id 
  ON whatsapp_messages(wa_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation_id 
  ON whatsapp_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_statuses_wa_id 
  ON whatsapp_statuses(wa_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_statuses_status_type 
  ON whatsapp_statuses(status_type);