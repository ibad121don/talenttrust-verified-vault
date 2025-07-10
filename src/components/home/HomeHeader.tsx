
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomeHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <img src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" alt="TrustTalent Logo" className="h-8 w-8 flex-shrink-0" />
            <span className="text-xl sm:text-2xl font-bold text-gray-900 truncate">TrustTalent</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 ml-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/login")} className="text-xs sm:text-sm px-2 sm:px-3">
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/register")} className="text-xs sm:text-sm px-2 sm:px-3">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
