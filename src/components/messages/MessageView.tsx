
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Star,
  Archive,
  Trash2
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

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

interface Message {
  id: number;
  sender: "me" | "other";
  content: string;
  timestamp: string;
  senderName: string;
}

interface MessageViewProps {
  conversation: Conversation | undefined;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onToggleFavorite: () => void;
  onArchiveConversation: () => void;
  onDeleteConversation: () => void;
}

const MessageView = ({
  conversation,
  messages,
  onSendMessage,
  onToggleFavorite,
  onArchiveConversation,
  onDeleteConversation
}: MessageViewProps) => {
  if (!conversation) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation from the left to start messaging</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} />
              <AvatarFallback>
                {conversation.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{conversation.name}</h3>
              <p className="text-sm text-gray-600">{conversation.company}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleFavorite}
              className={conversation.isFavorite ? "text-yellow-500" : ""}
            >
              <Star className={`h-4 w-4 ${conversation.isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={onArchiveConversation}>
              <Archive className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onToggleFavorite}>
                  <Star className="h-4 w-4 mr-2" />
                  {conversation.isFavorite ? "Remove from favorites" : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onArchiveConversation}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDeleteConversation} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete conversation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full p-0">
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-80">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        {/* Message Input */}
        <MessageInput onSendMessage={onSendMessage} />
      </CardContent>
    </Card>
  );
};

export default MessageView;
