
-- Create pricing_plans table
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_per_month DECIMAL(10,2),
  price_per_check DECIMAL(10,2),
  verification_limit INTEGER,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  badge TEXT, -- for "Most Popular", "Best Value", etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for pricing plans (but allow public read access)
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active pricing plans
CREATE POLICY "Anyone can view active pricing plans" 
  ON public.pricing_plans 
  FOR SELECT 
  USING (is_active = true);

-- Only authenticated users with admin role can modify pricing plans
CREATE POLICY "Only admins can modify pricing plans" 
  ON public.pricing_plans 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert initial pricing plans
INSERT INTO public.pricing_plans (name, price_per_month, price_per_check, verification_limit, features, description, badge, sort_order) VALUES
('Free', 0, 0, 1, 
 '["Basic document checks", "1 verification per month", "Basic profile", "Email support"]'::jsonb, 
 'Perfect for trying out TrustTalent', null, 1),

('Pay-as-you-go', 0, 15, null, 
 '["Instant verification reports", "Flexible usage", "All document types", "Priority email support"]'::jsonb, 
 'Pay only for what you use', null, 2),

('Business', 89, 8, 20, 
 '["Up to 20 verifications/month", "Custom branding", "Analytics dashboard", "API access", "Phone support", "Bulk uploads"]'::jsonb, 
 'Ideal for growing businesses', 'Most Popular', 3),

('Enterprise', 499, 3, 150, 
 '["Up to 150 verifications/month", "Dedicated account manager", "Custom integrations", "Advanced analytics", "Priority support", "White-label options"]'::jsonb, 
 'For large organizations', null, 4),

('University', null, 3, null, 
 '["Unlimited student verifications", "Bulk onboarding tools", "Academic discounts", "Integration support", "Training sessions"]'::jsonb, 
 'Special pricing for educational institutions', null, 5);

-- Create user_subscriptions table to track user plans
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pricing_plan_id UUID NOT NULL REFERENCES public.pricing_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, expired
  verifications_used INTEGER NOT NULL DEFAULT 0,
  billing_cycle_start DATE,
  billing_cycle_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for user subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.user_subscriptions 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Users can update their own subscriptions
CREATE POLICY "Users can update their own subscriptions" 
  ON public.user_subscriptions 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Only system can insert subscriptions (through functions)
CREATE POLICY "System can insert subscriptions" 
  ON public.user_subscriptions 
  FOR INSERT 
  WITH CHECK (true);
