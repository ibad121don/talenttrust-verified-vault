
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { PricingPlan } from "@/services/pricingService";

interface PricingCardProps {
  plan: PricingPlan;
  isCurrentPlan?: boolean;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
}

const PricingCard = ({ plan, isCurrentPlan, onSelectPlan, isLoading }: PricingCardProps) => {
  const formatPrice = () => {
    if (plan.price_per_month === null && plan.price_per_check === null) {
      return "Contact Sales";
    }
    if (plan.price_per_month === 0 && plan.price_per_check === 0) {
      return "Free";
    }
    if (plan.price_per_month && plan.price_per_month > 0) {
      return `$${plan.price_per_month}/month`;
    }
    if (plan.price_per_check && plan.price_per_check > 0) {
      return `$${plan.price_per_check}/check`;
    }
    return "Custom";
  };

  const getButtonText = () => {
    if (isCurrentPlan) {
      return "Current Plan";
    }
    if (plan.name === "Free") {
      return "Get Started Free";
    }
    if (plan.name === "University" || plan.name === "Enterprise") {
      return "Contact Sales";
    }
    return "Upgrade Now";
  };

  const shouldShowContactSales = plan.name === "University" || plan.name === "Enterprise";

  return (
    <Card className={`relative h-full ${plan.badge ? 'ring-2 ring-blue-500' : ''}`}>
      {plan.badge && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
          {plan.badge}
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <div className="text-3xl font-bold text-blue-600 mt-2">
          {formatPrice()}
        </div>
        {plan.description && (
          <CardDescription className="mt-2">{plan.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
          {plan.verification_limit && (
            <li className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">Up to {plan.verification_limit} verifications per month</span>
            </li>
          )}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan || isLoading}
          onClick={() => shouldShowContactSales ? window.open('mailto:sales@trusttalent.com') : onSelectPlan(plan.id)}
        >
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
