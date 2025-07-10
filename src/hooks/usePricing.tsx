
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { pricingService, PricingPlan, UserSubscription } from "@/services/pricingService";

export const usePricing = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPricingPlans = async () => {
    const { plans: fetchedPlans, error: plansError } = await pricingService.getPricingPlans();
    if (plansError) {
      setError(plansError);
      return;
    }
    if (fetchedPlans) {
      setPlans(fetchedPlans);
    }
  };

  const loadUserSubscription = async () => {
    if (!user?.id) return;
    
    const { subscription, error: subscriptionError } = await pricingService.getUserSubscription(user.id);
    if (!subscriptionError && subscription) {
      setUserSubscription(subscription);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      await loadPricingPlans();
      await loadUserSubscription();
      
      setIsLoading(false);
    };

    loadData();
  }, [user]);

  const createSubscription = async (planId: string) => {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const { subscription, error } = await pricingService.createSubscription(user.id, planId);
    
    if (error) {
      throw new Error(error);
    }

    // Reload user subscription after successful creation
    await loadUserSubscription();
    
    return subscription;
  };

  return {
    plans,
    userSubscription,
    isLoading,
    error,
    createSubscription,
    refetch: () => {
      loadPricingPlans();
      loadUserSubscription();
    }
  };
};
