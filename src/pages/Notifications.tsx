
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LinkedInStyleNavigation from "@/components/navigation/LinkedInStyleNavigation";
import { 
  Bell, 
  Shield, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  MessageSquare,
  Star,
  Trash2,
  Mail
} from "lucide-react";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Mock notifications data with British terminology
  const notifications = [
    {
      id: 1,
      type: "job_match",
      title: "New Job Match",
      message: "A new Software Engineer position at TechCorp Ltd matches your verified skills perfectly!",
      timestamp: "2 hours ago",
      read: false,
      icon: Briefcase,
      color: "blue"
    },
    {
      id: 2,
      type: "verification",
      title: "Document Verified",
      message: "Your AWS Certificate has been successfully verified and added to your profile.",
      timestamp: "1 day ago",
      read: false,
      icon: CheckCircle,
      color: "green"
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      message: "Sarah Chen from TechCorp sent you a message about the Senior Engineer role.",
      timestamp: "2 days ago",
      read: true,
      icon: MessageSquare,
      color: "purple"
    },
    {
      id: 4,
      type: "application",
      title: "Application Update",
      message: "Your application for Product Manager at StartupXYZ has been reviewed.",
      timestamp: "3 days ago",
      read: true,
      icon: Star,
      color: "orange"
    },
    {
      id: 5,
      type: "verification",
      title: "Verification Required",
      message: "Please upload additional documents to complete your profile verification.",
      timestamp: "5 days ago",
      read: false,
      icon: AlertTriangle,
      color: "yellow"
    },
    {
      id: 6,
      type: "job_match",
      title: "Premium Job Match",
      message: "A high-priority UX Designer position in London requires your specific qualifications.",
      timestamp: "1 week ago",
      read: true,
      icon: Briefcase,
      color: "blue"
    }
  ];

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter(n => !n.read);
      case "job_matches":
        return notifications.filter(n => n.type === "job_match");
      case "messages":
        return notifications.filter(n => n.type === "message");
      case "verification":
        return notifications.filter(n => n.type === "verification");
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconColor = (color: string) => {
    switch (color) {
      case "blue": return "text-blue-600 bg-blue-100";
      case "green": return "text-green-600 bg-green-100";
      case "purple": return "text-purple-600 bg-purple-100";
      case "orange": return "text-orange-600 bg-orange-100";
      case "yellow": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LinkedInStyleNavigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Stay updated on job matches, verifications, and messages</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="all">
              All Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-red-100 text-red-700 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="job_matches">Job Matches</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-4">
              {getFilteredNotifications().map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <Card key={notification.id} className={`hover:shadow-md transition-shadow ${
                    !notification.read ? 'border-blue-200 bg-blue-50/30' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getIconColor(notification.color)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <span className="text-sm text-gray-500">{notification.timestamp}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="flex items-center space-x-2">
                            {notification.type === "job_match" && (
                              <Button size="sm" variant="outline">
                                View Job
                              </Button>
                            )}
                            {notification.type === "message" && (
                              <Button size="sm" variant="outline">
                                Reply
                              </Button>
                            )}
                            {notification.type === "verification" && (
                              <Button size="sm" variant="outline">
                                View Documents
                              </Button>
                            )}
                            
                            <Button variant="ghost" size="sm">
                              {notification.read ? (
                                <>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Mark Unread
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Read
                                </>
                              )}
                            </Button>
                            
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {getFilteredNotifications().length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">
                      {activeTab === "unread" 
                        ? "You're all caught up! No unread notifications."
                        : "You don't have any notifications in this category yet."
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notifications;
