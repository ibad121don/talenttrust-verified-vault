
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  text: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, text }) => {
  return (
    <div className="absolute top-6 left-6 z-10">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClick}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {text}
      </Button>
    </div>
  );
};
