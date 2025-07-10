
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

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

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, isSelected, onClick }: ConversationItemProps) => {
  return (
    <div
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatar} />
          <AvatarFallback>
            {conversation.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`text-sm font-medium truncate ${
              conversation.unread ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {conversation.name}
              {conversation.isFavorite && (
                <Star className="inline h-3 w-3 ml-1 text-yellow-500 fill-current" />
              )}
            </h4>
            {conversation.unread && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-1">{conversation.company}</p>
          <p className={`text-sm truncate ${
            conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'
          }`}>
            {conversation.lastMessage}
          </p>
          <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
