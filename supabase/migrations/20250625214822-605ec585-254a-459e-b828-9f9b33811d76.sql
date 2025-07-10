
-- First, ensure the avatars bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Create policy to allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Create policy to allow anyone to view avatars (since they're profile pictures)
CREATE POLICY "Anyone can view avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

-- Create policy to allow authenticated users to update avatars
CREATE POLICY "Users can update avatars" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'avatars');

-- Create policy to allow authenticated users to delete avatars
CREATE POLICY "Users can delete avatars" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'avatars');
