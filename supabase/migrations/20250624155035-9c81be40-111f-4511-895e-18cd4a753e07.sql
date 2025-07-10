
-- Create a table to store verification results
CREATE TABLE public.verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  document_id UUID REFERENCES public.documents(id),
  filename TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'verified', 'suspicious', 'failed')) NOT NULL DEFAULT 'pending',
  explanation TEXT,
  ai_confidence_score DECIMAL(5,2),
  processed_text TEXT,
  admin_override BOOLEAN DEFAULT false,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on verifications table
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own verifications
CREATE POLICY "Users can view their own verifications" 
  ON public.verifications 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Create policy that allows users to insert their own verifications
CREATE POLICY "Users can create their own verifications" 
  ON public.verifications 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Add admin role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END $$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create policy for admins to view all verifications
CREATE POLICY "Admins can view all verifications" 
  ON public.verifications 
  FOR SELECT 
  TO authenticated
  USING (public.has_role((SELECT id FROM public.users WHERE auth_id = auth.uid()), 'admin'));

-- Create policy for admins to update verifications
CREATE POLICY "Admins can update verifications" 
  ON public.verifications 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role((SELECT id FROM public.users WHERE auth_id = auth.uid()), 'admin'));
