import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { pricingService, PricingPlan, UserSubscription } from "@/services/pricingService";
import PricingCard from "@/components/pricing/PricingCard";
import { Bell, User, Home, Briefcase, Lock, MessageSquare, DollarSign } from "lucide-react";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import HomeFooter from "@/components/home/HomeFooter";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      icon: Home,
      label: 'Dashboard',
      path: '/dashboard/seeker',
      isActive: false
    },
    {
      id: 'jobs',
      icon: Briefcase,
      label: 'Find Jobs',
      path: '/jobs',
      isActive: false
    },
    {
      id: 'vault',
      icon: Lock,
      label: 'My Vault',
      path: '/vault',
      isActive: false
    },
    {
      id: 'messages',
      icon: MessageSquare,
      label: 'Messages',
      path: '/messages',
      isActive: false
    },
    {
      id: 'pricing',
      icon: DollarSign,
      label: 'Pricing',
      path: '/pricing',
      isActive: true
    }
  ];

  useEffect(() => {
    loadPricingData();
  }, [user]);

  const loadPricingData = async () => {
    setIsLoading(true);
    
    // Load pricing plans
    const { plans: fetchedPlans, error: plansError } = await pricingService.getPricingPlans();
    if (plansError) {
      toast({
        title: "Error",
        description: "Failed to load pricing plans",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (fetchedPlans) {
      setPlans(fetchedPlans);
    }

    // Load user subscription if logged in
    if (user?.id) {
      const { subscription, error: subscriptionError } = await pricingService.getUserSubscription(user.id);
      if (!subscriptionError && subscription) {
        setUserSubscription(subscription);
      }
    }

    setIsLoading(false);
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      navigate("/login", { state: { returnTo: "/pricing" } });
      return;
    }

    setIsProcessing(true);

    const { subscription, error } = await pricingService.createSubscription(user.id, planId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe to plan. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Successfully subscribed to the plan!",
      });
      loadPricingData(); // Reload to show updated subscription
    }

    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-lg">Loading pricing plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" alt="TrustTalent Logo" className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-lg sm:text-xl font-bold text-gray-900">TrustTalent</span>
              </div>
              <nav className="hidden md:flex space-x-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className={`flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors relative ${
                        item.isActive
                          ? 'text-[#183B6B] bg-blue-50'
                          : 'text-gray-600 hover:text-[#183B6B] hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mb-1" />
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/notifications")} className="hidden sm:flex">
                <span className="sr-only">Notifications</span>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="hidden sm:flex">
                <span className="sr-only">Profile</span>
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose the Right Plan for You
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. Our flexible pricing ensures you only pay for what you need.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={userSubscription?.pricing_plan_id === plan.id}
              onSelectPlan={handleSelectPlan}
              isLoading={isProcessing}
            />
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards and PayPal for your convenience.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! Our Free plan includes 1 verification per month with no time limit.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Need help choosing?</h3>
              <p className="text-gray-600">Contact our sales team at <a href="mailto:sales@trusttalent.com" className="text-blue-600 hover:underline">sales@trusttalent.com</a> for personalized recommendations.</p>
            </div>
          </div>
        </div>
      </div>
      
      <HomeFooter />
    </div>
  );
};

export default Pricing;
