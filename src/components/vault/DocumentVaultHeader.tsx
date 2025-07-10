import { Button } from "@/components/ui/button";
import { Bell, User, Home, Briefcase, Lock, MessageSquare, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileNavigation from "@/components/navigation/MobileNavigation";

const DocumentVaultHeader = () => {
  const navigate = useNavigate();

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
      isActive: true
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
      isActive: false
    }
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-6 min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" alt="TrustTalent Logo" className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">TrustTalent</span>
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
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="hidden sm:flex">
              <User className="h-4 w-4" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DocumentVaultHeader;
