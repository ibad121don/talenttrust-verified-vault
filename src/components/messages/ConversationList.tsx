
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, MessageSquare } from "lucide-react";
import ConversationItem from "./ConversationItem";

interface Conversation {
  id: number;
  name: string;
  company: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar: string | null;
  role: string;
  isFavorite: boolean;
  isArchived: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: number;
  searchTerm: string;
  showFavoritesOnly: boolean;
  onConversationSelect: (id: number) => void;
  onSearchChange: (term: string) => void;
  onToggleFavoritesFilter: () => void;
}

const ConversationList = ({
  conversations = [], // Add default empty array
  selectedConversation,
  searchTerm,
  showFavoritesOnly,
  onConversationSelect,
  onSearchChange,
  onToggleFavoritesFilter
}: ConversationListProps) => {
  // Early return if conversations is not an array
  if (!Array.isArray(conversations)) {
    console.warn("ConversationList: conversations prop is not an array:", conversations);
    return (
      <Card className="lg:col-span-1">
        <CardContent className="p-8 text-center text-gray-500">
          <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>Loading conversations...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredConversations = conversations.filter(conversation => {
    if (conversation.isArchived) return false;
    
    const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFavorites = showFavoritesOnly ? conversation.isFavorite : true;
    
    return matchesSearch && matchesFavorites;
  });

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Conversations</CardTitle>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={onToggleFavoritesFilter}
              className="flex-1"
            >
              <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
              Favorites
            </Button>
            <Button
              variant={!showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={onToggleFavoritesFilter}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {showFavoritesOnly ? (
                <>
                  <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No favorite conversations yet</p>
                  <p className="text-sm">Star conversations to see them here</p>
                </>
              ) : (
                <>
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No conversations found</p>
                </>
              )}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation === conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
