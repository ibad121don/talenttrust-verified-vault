
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  User,
  ChevronDown
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const LinkedInStyleNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const [notifications] = useState(3); // Mock notification count

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
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      path: '/dashboard/seeker',
      isActive: location.pathname === '/dashboard/seeker' || location.pathname === '/'
    },
    {
      id: 'network',
      icon: Users,
      label: 'My Network',
      path: '/network',
      isActive: location.pathname === '/network'
    },
    {
      id: 'jobs',
      icon: Briefcase,
      label: 'Jobs',
      path: '/jobs',
      isActive: location.pathname === '/jobs'
    },
    {
      id: 'messaging',
      icon: MessageSquare,
      label: 'Messaging',
      path: '/messages',
      isActive: location.pathname === '/messages'
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
      isActive: location.pathname === '/notifications',
      badge: notifications
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" 
              alt="TrustTalent Logo" 
              className="h-8 w-8" 
            />
            <span className="text-xl font-bold text-[#183B6B] hidden sm:inline">
              TrustTalent
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors relative ${
                    item.isActive
                      ? 'text-[#183B6B] bg-blue-50'
                      : 'text-gray-600 hover:text-[#183B6B] hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <IconComponent className="h-5 w-5 mb-1" />
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-[#E2B319] text-white flex items-center justify-center border-none"
                      >
                        {item.badge > 9 ? '9+' : item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-[#E2B319] rounded-t-full" />
                  )}
                </button>
              );
            })}

            {/* Profile Menu */}
            <button
              onClick={() => handleNavigation('/profile')}
              className={`flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors relative ${
                location.pathname === '/profile'
                  ? 'text-[#183B6B] bg-blue-50'
                  : 'text-gray-600 hover:text-[#183B6B] hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xs bg-[#183B6B] text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3 hidden sm:inline" />
              </div>
              <span className="hidden sm:inline">Me</span>
              {location.pathname === '/profile' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-[#E2B319] rounded-t-full" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LinkedInStyleNavigation;
