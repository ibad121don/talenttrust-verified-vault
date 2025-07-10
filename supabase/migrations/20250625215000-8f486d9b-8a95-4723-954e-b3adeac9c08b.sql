
-- Enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = auth_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = auth_id);

-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert own profile" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

-- Allow service role to manage all user profiles (for admin operations)
CREATE POLICY "Service role can manage all profiles" 
ON public.users 
FOR ALL 
TO service_role 
USING (true);
