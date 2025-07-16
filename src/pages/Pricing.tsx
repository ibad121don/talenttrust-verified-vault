import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  pricingService,
  PricingPlan,
  UserSubscription,
} from "@/services/pricingService";
import PricingCard from "@/components/pricing/PricingCard";
import {
  Bell,
  User,
  Home,
  Briefcase,
  Lock,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import HomeFooter from "@/components/home/HomeFooter";
import { stripePromise } from "@/lib/stripeClient";

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const navigationItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      path: "/dashboard/seeker",
      isActive: false,
    },
    {
      id: "jobs",
      icon: Briefcase,
      label: "Find Jobs",
      path: "/jobs",
      isActive: false,
    },
    {
      id: "vault",
      icon: Lock,
      label: "My Vault",
      path: "/vault",
      isActive: false,
    },
    {
      id: "messages",
      icon: MessageSquare,
      label: "Messages",
      path: "/messages",
      isActive: false,
    },
    {
      id: "pricing",
      icon: DollarSign,
      label: "Pricing",
      path: "/pricing",
      isActive: true,
    },
  ];

  useEffect(() => {
    loadPricingData();
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("success")) {
      toast({
        title: "Payment Successful",
        description: "Your subscription is now active!",
      });
    }
    if (params.get("canceled")) {
      toast({
        title: "Payment Canceled",
        description: "You can try again.",
        variant: "destructive",
      });
    }
  }, [location.search]);

  const loadPricingData = async () => {
    setIsLoading(true);

    const { plans: fetchedPlans, error: plansError } =
      await pricingService.getPricingPlans();
    if (plansError) {
      toast({
        title: "Error",
        description: "Failed to load pricing plans",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (fetchedPlans) setPlans(fetchedPlans);

    if (user?.id) {
      const { subscription, error: subscriptionError } =
        await pricingService.getUserSubscription(user.id);
      if (!subscriptionError && subscription) {
        setUserSubscription(subscription);
      }
    }

    setIsLoading(false);
  };

  // const handleSelectPlan = async (planId: string) => {
  //   if (!user) {
  //     navigate("/login", { state: { returnTo: "/pricing" } });
  //     return;
  //   }

  //   setProcessingPlanId(planId);

  //   try {
  //     const res = await fetch(
  //       "http://localhost:8001/api/v1/stripe/create-checkout-session",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ userId: user.id, planId }),
  //       }
  //     );

  //     const response = await res.json();
  //     if (!res.ok || !response?.data?.id) {
  //       throw new Error(
  //         response.message || "Failed to create checkout session"
  //       );
  //     }

  //     const stripe = await stripePromise;
  //     if (!stripe) throw new Error("Stripe not loaded");

  //     const { error } = await stripe.redirectToCheckout({
  //       sessionId: response.data.id,
  //     });
  //     if (error) throw error;
  //   } catch (error: any) {
  //     toast({
  //       title: "Error",
  //       description: error.message || "Could not redirect to checkout.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setProcessingPlanId(null);
  //   }
  // };
  const handleSelectPlan = async (planId: string, id: string) => {
    if (!user) {
      navigate("/login", { state: { returnTo: "/pricing" } });
      return;
    }

    setProcessingPlanId(planId);
    console.log("🛒 Selected plan:", id);

    try {
      if (id == "Free") {
        navigate("/dashboard/seeker");
        return;
      }

      // data store local
      let dataUser = await localStorage.getItem("userprofile");
      let tempUser = JSON.parse(dataUser);
      await localStorage.setItem(
        "user_subcription",
        JSON.stringify({
          userId: tempUser.id,
          planId: planId,
        })
      );

      // For Standard and Premium plans
      const res = await fetch(
        "https://talent-backend-production.up.railway.app/api/v1/stripe/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, planId: id.toLowerCase() }),
        }
      );

      const response = await res.json();
      if (!res.ok || !response?.data?.id) {
        throw new Error(
          response.message || "Failed to create checkout session"
        );
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe not loaded");

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
      if (error) throw error;
    } catch (error: any) {
      console.log("❌ Error during plan selection:", error.message);
      toast({
        title: "Error",
        description: error.message || "Could not process the plan selection.",
        variant: "destructive",
      });
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-lg">Loading pricing plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-6 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/logo.png"
                alt="Logo"
                className="h-6 w-6"
              />
              <span className="text-xl font-bold text-gray-900">
                TrustTalent
              </span>
            </div>
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors relative ${
                      item.isActive
                        ? "text-[#183B6B] bg-blue-50"
                        : "text-gray-600 hover:text-[#183B6B] hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{item.label}</span>
                    {item.isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-[#E2B319] rounded-t-full" />
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <MobileNavigation />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/notifications")}
              className="hidden sm:flex"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="hidden sm:flex"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose the Right Plan for You
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. Our flexible pricing ensures you
            only pay for what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={userSubscription?.pricing_plan_id === plan.id}
              onSelectPlan={() => {
                handleSelectPlan(plan.id, plan.name);
              }}
              isLoading={processingPlanId === plan.id}
            />
          ))}
        </div>
      </main>

      <HomeFooter />
    </div>
  );
};

export default Pricing;
