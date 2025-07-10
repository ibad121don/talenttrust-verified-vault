
interface Message {
  id: number;
  sender: "me" | "other";
  content: string;
  timestamp: string;
  senderName: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.sender === 'me'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${
          message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
