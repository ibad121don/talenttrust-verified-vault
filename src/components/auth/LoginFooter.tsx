
import React from "react";
import { Button } from "@/components/ui/button";

interface LoginFooterProps {
  showForgotPassword: boolean;
  onForgotPasswordClick: () => void;
  onRegisterClick: () => void;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({
  showForgotPassword,
  onForgotPasswordClick,
  onRegisterClick
}) => {
  if (showForgotPassword) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="text-center">
        <Button 
          variant="link" 
          className="text-sm"
          onClick={onForgotPasswordClick}
        >
          Forgot your password?
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Button variant="link" className="p-0" onClick={onRegisterClick}>
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
};
