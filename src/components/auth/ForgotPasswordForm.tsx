
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps {
  resetEmail: string;
  isResetting: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  resetEmail,
  isResetting,
  onEmailChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resetEmail">Email *</Label>
        <Input
          id="resetEmail"
          name="resetEmail"
          type="email"
          value={resetEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          placeholder="you@example.com"
          disabled={isResetting}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isResetting}
        >
          {isResetting ? "Sending..." : "Send Reset Email"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isResetting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
