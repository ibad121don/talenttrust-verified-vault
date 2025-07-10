
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Home, Briefcase, FileText, MessageSquare, User, Bell, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const getInitials = () => {
    if (userProfile?.full_name) {
      const nameParts = userProfile.full_name.split(' ');
      const firstInitial = nameParts[0]?.[0] || '';
      const lastInitial = nameParts[1]?.[0] || '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U';
  };

  const avatarUrl = user?.id ? `https://mjaqvbuhnhatofwkgako.supabase.co/storage/v1/object/public/avatars/avatars/${user.id}.jpg` : undefined;

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard/seeker" },
    { icon: Briefcase, label: "Find Jobs", path: "/jobs" },
    { icon: FileText, label: "My Vault", path: "/vault" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: DollarSign, label: "Pricing", path: "/pricing" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5 text-[#183B6B]" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" alt="TrustTalent Logo" className="h-6 w-6" />
              <span className="text-lg font-bold text-[#183B6B]">TrustTalent</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-[#183B6B] text-white">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm text-[#183B6B]">
                  {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-blue-50 hover:text-[#183B6B] transition-colors"
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="h-4 w-4 mr-3 text-[#183B6B]" />
                  <span className="text-gray-700">{item.label}</span>
                </Button>
              ))}
            </div>
          </nav>

          {/* Footer accent */}
          <div className="border-t border-gray-200 pt-4">
            <div className="h-1 w-full bg-gradient-to-r from-[#183B6B] to-[#E2B319] rounded-full"></div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
