import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConversationList from "@/components/messages/ConversationList";
import MessageView from "@/components/messages/MessageView";
import { Bell, User, Home, Briefcase, Lock, MessageSquare, DollarSign } from "lucide-react";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import HomeFooter from "@/components/home/HomeFooter";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedConversationId, setSelectedConversationId] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Mock data for conversations and messages
  const mockConversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      lastMessage: "Thanks for your application!",
      timestamp: "2 hours ago",
      unread: true,
      avatar: null,
      role: "HR Manager",
      isFavorite: false,
      isArchived: false
    },
    {
      id: 2,
      name: "Mike Chen",
      company: "StartupXYZ",
      lastMessage: "When can you start?",
      timestamp: "1 day ago",
      unread: false,
      avatar: null,
      role: "CTO",
      isFavorite: true,
      isArchived: false
    }
  ];

  const mockMessages = [
    {
      id: 1,
      sender: "other" as const,
      content: "Hi! Thanks for applying to our position.",
      timestamp: "10:30 AM",
      senderName: "Sarah Johnson"
    },
    {
      id: 2,
      sender: "me" as const,
      content: "Thank you for considering my application!",
      timestamp: "10:32 AM",
      senderName: "You"
    }
  ];

  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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
      isActive: false
    },
    {
      id: 'messages',
      icon: MessageSquare,
      label: 'Messages',
      path: '/messages',
      isActive: true
    },
    {
      id: 'pricing',
      icon: DollarSign,
      label: 'Pricing',
      path: '/pricing',
      isActive: false
    }
  ];

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message);
  };

  const handleToggleFavorite = () => {
    console.log("Toggle favorite for conversation:", selectedConversationId);
  };

  const handleArchiveConversation = () => {
    console.log("Archive conversation:", selectedConversationId);
  };

  const handleDeleteConversation = () => {
    console.log("Delete conversation:", selectedConversationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <img src="/lovable-uploads/2c6e0c31-9b9d-41e7-8a6c-71bbba71fe34.png" alt="TrustTalent Logo" className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-lg sm:text-xl font-bold text-gray-900">TrustTalent</span>
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
                <span className="sr-only">Notifications</span>
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} className="hidden sm:flex">
                <span className="sr-only">Profile</span>
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Stay connected with employers and potential opportunities.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <ConversationList
            conversations={mockConversations}
            selectedConversation={selectedConversationId}
            searchTerm={searchTerm}
            showFavoritesOnly={showFavoritesOnly}
            onConversationSelect={(id: number) => setSelectedConversationId(id)}
            onSearchChange={setSearchTerm}
            onToggleFavoritesFilter={() => setShowFavoritesOnly(!showFavoritesOnly)}
          />

          {/* Message View */}
          <MessageView
            conversation={selectedConversation}
            messages={mockMessages}
            onSendMessage={handleSendMessage}
            onToggleFavorite={handleToggleFavorite}
            onArchiveConversation={handleArchiveConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>
      </div>
      
      <HomeFooter />
    </div>
  );
};

export default Messages;
