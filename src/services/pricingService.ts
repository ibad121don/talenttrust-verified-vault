
import { supabase } from '@/integrations/supabase/client';

export interface PricingPlan {
  id: string;
  name: string;
  price_per_month: number | null;
  price_per_check: number | null;
  verification_limit: number | null;
  features: string[];
  description: string | null;
  badge: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  pricing_plan_id: string;
  status: string;
  verifications_used: number;
  billing_cycle_start: string | null;
  billing_cycle_end: string | null;
  pricing_plan: PricingPlan;
}

class PricingService {
  async getPricingPlans() {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching pricing plans:', error);
        return { plans: null, error: error.message };
      }

      return { plans: data as PricingPlan[], error: null };
    } catch (error: any) {
      console.error('Unexpected error fetching pricing plans:', error);
      return { plans: null, error: 'An unexpected error occurred' };
    }
  }

  async getUserSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          pricing_plan:pricing_plans(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error fetching user subscription:', error);
        return { subscription: null, error: error.message };
      }

      return { subscription: data as UserSubscription | null, error: null };
    } catch (error: any) {
      console.error('Unexpected error fetching user subscription:', error);
      return { subscription: null, error: 'An unexpected error occurred' };
    }
  }

  async createSubscription(userId: string, planId: string) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          pricing_plan_id: planId,
          status: 'active',
          billing_cycle_start: new Date().toISOString().split('T')[0],
          billing_cycle_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        return { subscription: null, error: error.message };
      }

      return { subscription: data, error: null };
    } catch (error: any) {
      console.error('Unexpected error creating subscription:', error);
      return { subscription: null, error: 'An unexpected error occurred' };
    }
  }
}

export const pricingService = new PricingService();
