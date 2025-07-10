
-- Create users table for profiles
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('job_seeker', 'employer', 'university', 'admin')) NOT NULL DEFAULT 'job_seeker',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create institutions table
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('university', 'certification_body', 'government', 'company')) NOT NULL,
  country TEXT,
  verification_endpoint TEXT,
  api_key_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('degree', 'certificate', 'license', 'reference', 'work_sample', 'cv_resume')) NOT NULL,
  issuer TEXT NOT NULL,
  institution_id UUID REFERENCES public.institutions(id),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('uploaded', 'pending', 'verified', 'failed', 'expired')) NOT NULL DEFAULT 'uploaded',
  privacy TEXT CHECK (privacy IN ('private', 'shared', 'public')) NOT NULL DEFAULT 'private',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verification_requests table
CREATE TABLE public.verification_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  request_type TEXT CHECK (request_type IN ('ai_analysis', 'institution_verify', 'manual_review')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')) NOT NULL DEFAULT 'pending',
  priority INTEGER DEFAULT 1,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verification_results table
CREATE TABLE public.verification_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verification_request_id UUID REFERENCES public.verification_requests(id) NOT NULL,
  document_id UUID REFERENCES public.documents(id) NOT NULL,
  verification_score INTEGER CHECK (verification_score >= 0 AND verification_score <= 100),
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high', 'very_high')),
  fraud_indicators JSONB,
  ai_analysis JSONB,
  institution_response JSONB,
  manual_review_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verifier_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create references table
CREATE TABLE public.references (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  document_id UUID REFERENCES public.documents(id),
  reference_name TEXT NOT NULL,
  reference_email TEXT,
  reference_phone TEXT,
  company TEXT,
  position TEXT,
  relationship TEXT,
  reference_form_sent BOOLEAN DEFAULT false,
  reference_form_completed BOOLEAN DEFAULT false,
  reference_score INTEGER CHECK (reference_score >= 0 AND reference_score <= 100),
  reference_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for user documents
INSERT INTO storage.buckets (id, name, public) VALUES ('user_documents', 'user_documents', false);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.references ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth_id = auth.uid());

-- RLS Policies for institutions table (public read)
CREATE POLICY "Anyone can view institutions" ON public.institutions
  FOR SELECT USING (true);

-- RLS Policies for documents table
CREATE POLICY "Users can view their own documents" ON public.documents
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert their own documents" ON public.documents
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update their own documents" ON public.documents
  FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- RLS Policies for verification_requests table
CREATE POLICY "Users can view their own verification requests" ON public.verification_requests
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert their own verification requests" ON public.verification_requests
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- RLS Policies for verification_results table
CREATE POLICY "Users can view their own verification results" ON public.verification_results
  FOR SELECT USING (document_id IN (
    SELECT id FROM public.documents WHERE user_id IN (
      SELECT id FROM public.users WHERE auth_id = auth.uid()
    )
  ));

-- RLS Policies for references table
CREATE POLICY "Users can view their own references" ON public.references
  FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can insert their own references" ON public.references
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update their own references" ON public.references
  FOR UPDATE USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Storage policies for user_documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'user_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user_documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Insert some sample institutions
INSERT INTO public.institutions (name, type, country) VALUES 
  ('Stanford University', 'university', 'USA'),
  ('Amazon Web Services', 'certification_body', 'USA'),
  ('Google Inc.', 'company', 'USA'),
  ('California DMV', 'government', 'USA');
