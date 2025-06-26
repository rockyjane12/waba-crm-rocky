/*
  # Add users table and storage policies
  
  1. Create users table with waba_id
  2. Add RLS policies for users table
  3. Add storage bucket policies
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  waba_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own record"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own record"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert a default user for testing (optional, remove in production)
INSERT INTO users (id, waba_id)
SELECT 
  auth.uid(),
  'default_waba_id'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid()
)
AND auth.role() = 'authenticated';

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name)
VALUES ('product_images', 'product_images')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policy for authenticated users
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product_images' AND
    (storage.foldername(name))[1] = (
      SELECT waba_id::text 
      FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can view own product images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'product_images' AND
    (storage.foldername(name))[1] = (
      SELECT waba_id::text 
      FROM users 
      WHERE id = auth.uid()
    )
  );

-- Policy to allow public read access to all product images
-- This is needed if you want the images to be publicly accessible
CREATE POLICY "Public read access to product images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product_images'); 