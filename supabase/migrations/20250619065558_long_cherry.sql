/*
  # Fix WhatsApp customers table schema
  
  1. Schema Updates
    - Ensure `whatsapp_customers` table has all required columns
    - Add missing columns: `last_message_at`, `last_message`, `conversation_status`
    - Add `metadata` column for additional data storage
    
  2. Data Integrity
    - Use safe column additions with IF NOT EXISTS checks
    - Set appropriate default values
    
  3. Performance
    - Add indexes for commonly queried columns
    
  4. Security
    - Ensure RLS is enabled with proper policies
*/

-- Ensure whatsapp_customers table exists with base structure
CREATE TABLE IF NOT EXISTS whatsapp_customers (
  id SERIAL PRIMARY KEY,
  wa_id text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  name text,
  profile_name text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns safely
DO $$
BEGIN
  -- Add last_message_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'last_message_at'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN last_message_at timestamptz;
  END IF;

  -- Add last_message column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'last_message'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN last_message text;
  END IF;

  -- Add conversation_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'conversation_status'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN conversation_status text DEFAULT 'inactive';
  END IF;

  -- Add metadata column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'whatsapp_customers' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE whatsapp_customers ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE whatsapp_customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$
BEGIN
  -- Policy for reading customers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'whatsapp_customers' AND policyname = 'Users can read all customers'
  ) THEN
    CREATE POLICY "Users can read all customers"
      ON whatsapp_customers
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Policy for inserting customers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'whatsapp_customers' AND policyname = 'Users can insert customers'
  ) THEN
    CREATE POLICY "Users can insert customers"
      ON whatsapp_customers
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Policy for updating customers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'whatsapp_customers' AND policyname = 'Users can update customers'
  ) THEN
    CREATE POLICY "Users can update customers"
      ON whatsapp_customers
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_customers_last_message_at 
  ON whatsapp_customers(last_message_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_whatsapp_customers_wa_id 
  ON whatsapp_customers(wa_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_customers_phone_number 
  ON whatsapp_customers(phone_number);

CREATE INDEX IF NOT EXISTS idx_whatsapp_customers_status 
  ON whatsapp_customers(status);

-- Update the updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_whatsapp_customers_updated_at'
  ) THEN
    CREATE TRIGGER update_whatsapp_customers_updated_at
      BEFORE UPDATE ON whatsapp_customers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;