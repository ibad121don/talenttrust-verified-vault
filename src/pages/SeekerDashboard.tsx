import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Shield,
  Briefcase,
  MessageSquare,
  Star,
  TrendingUp,
  Bell,
  User,
  RefreshCw,
  Home,
  Lock,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUnifiedDashboardData } from "@/hooks/useUnifiedDashboardData";
import { useEffect, useState } from "react";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import HomeFooter from "@/components/home/HomeFooter";

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, stats, isRefreshing, refreshAllData } =
    useUnifiedDashboardData();
  const [displayName, setDisplayName] = useState("Your Name");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  // Fix: Move navigation logic to useEffect
  useEffect(() => {
    // if (!user) {
    //   navigate("/login");
    // }
  }, [user, navigate]);
  useEffect(() => {
    if (userProfile && user) {
      // Parse full name or use email
      const fullName = userProfile.full_name?.trim();
      if (fullName) {
        setDisplayName(fullName);
      } else if (user.email) {
        setDisplayName(user.email.split("@")[0]);
      }

      // Set avatar URL if exists
      if (user.id) {
        setAvatarUrl(
          `https://mjaqvbuhnhatofwkgako.supabase.co/storage/v1/object/public/avatars/avatars/${user.id}.jpg`
        );
      }
    }
  }, [userProfile, user]);

  // Generate initials from display name
  const getInitials = () => {
    if (userProfile?.full_name) {
      const nameParts = userProfile.full_name.split(" ");
      const firstInitial = nameParts[0]?.[0] || "";
      const lastInitial = nameParts[1]?.[0] || "";
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    return displayName?.slice(0, 2).toUpperCase() || "U";
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const navigationItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      path: "/dashboard/seeker",
      isActive: true,
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
      isActive: false,
    },
  ];

  const dashboardStats = [
    {
      label: "Documents Uploaded",
      value: stats.totalDocuments,
      icon: FileText,
    },
    {
      label: "Verification Score",
      value: `${stats.verificationScore}%`,
      icon: Shield,
    },
    {
      label: "Applications Sent",
      value: stats.applicationsent,
      icon: Briefcase,
    },
    {
      label: "Profile Views",
      value: stats.profileViews,
      icon: TrendingUp,
    },
  ];
  const recentActivity = [
    {
      action: "Document verified",
      item: "University Degree",
      time: "2 hours ago",
      status: "success",
    },
    {
      action: "Application sent",
      item: "Software Engineer at TechCorp",
      time: "1 day ago",
      status: "pending",
    },
    {
      action: "Profile updated",
      item: "Work experience added",
      time: "2 days ago",
      status: "info",
    },
    {
      action: "Document uploaded",
      item: "Professional Certificate",
      time: "3 days ago",
      status: "success",
    },
  ];
  const quickActions = [
    {
      title: "Upload Document",
      description: "Add new credentials to your vault",
      icon: FileText,
      action: () => navigate("/vault"),
    },
    {
      title: "Find Jobs",
      description: "Browse and apply to new opportunities",
      icon: Briefcase,
      action: () => navigate("/jobs"),
    },
    {
      title: "Update Profile",
      description: "Keep your information current",
      icon: User,
      action: () => navigate("/profile"),
    },
    {
      title: "Messages",
      description: "Check your conversations",
      icon: MessageSquare,
      action: () => navigate("/messages"),
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <img
                  src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png"
                  alt="TrustTalent Logo"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                />
                <span className="text-lg font-bold text-gray-900 sm:text-3xl">
                  TrustTalent
                </span>
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
                          ? "text-[#183B6B] bg-blue-50"
                          : "text-gray-600 hover:text-[#183B6B] hover:bg-gray-50"
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/notifications")}
                className="hidden sm:flex"
              >
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshAllData}
                disabled={isRefreshing}
                className="hidden sm:flex"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span className="sr-only">Refresh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="hidden sm:flex items-center space-x-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm">{displayName}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {displayName.split(" ")[0] || displayName}!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Here's what's happening with your job search today.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAllData}
              disabled={isRefreshing}
              className="sm:hidden"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-sm">
                  Get things done faster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                      onClick={action.action}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <action.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                              {action.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-sm">
                  Your latest updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          activity.status === "success"
                            ? "bg-green-500"
                            : activity.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {activity.item}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Completion */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              <span>Profile Completion</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Complete your profile to get better job matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">
                {stats.totalDocuments > 0
                  ? Math.min(75 + stats.totalDocuments * 5, 100)
                  : 25}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalDocuments > 0
                      ? Math.min(75 + stats.totalDocuments * 5, 100)
                      : 25
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                ✓ Basic Info
              </Badge>
              <Badge variant="outline" className="text-xs">
                ✓ Work Experience
              </Badge>
              <Badge
                variant={stats.totalDocuments > 0 ? "outline" : "secondary"}
                className="text-xs"
              >
                {stats.totalDocuments > 0 ? "✓" : ""} Documents (
                {stats.totalDocuments})
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Skills
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <HomeFooter />
    </div>
  );
};
export default SeekerDashboard;
