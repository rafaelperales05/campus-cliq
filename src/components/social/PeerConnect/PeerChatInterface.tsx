import { useState, useEffect } from "react";
import { Send, PlusCircle, Smile, ArrowLeft, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  isSent: boolean;
}

interface ChatInterfaceProps {
  recipientId: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

const botMessages = [
  {
    id: "bot-1",
    content: "👋 Welcome to Campus Connect! I'm your personal assistant. I can help you:",
    sender: {
      id: "campus-bot",
      name: "Campus Assistant",
      avatar: "/placeholder.svg",
    },
    timestamp: "Just now",
    isSent: false,
  },
  {
    id: "bot-2",
    content: "• Find study partners for your courses\n• Connect with students in your major\n• Join interest-based study groups\n• Get matched with peers based on your interests",
    sender: {
      id: "campus-bot",
      name: "Campus Assistant",
      avatar: "/placeholder.svg",
    },
    timestamp: "Just now",
    isSent: false,
  },
  {
    id: "bot-3",
    content: "What would you like help with?",
    sender: {
      id: "campus-bot",
      name: "Campus Assistant",
      avatar: "/placeholder.svg",
    },
    timestamp: "Just now",
    isSent: false,
  },
];

const peerMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      content: "Hey! I saw you're also in the CS program. What classes are you taking this semester?",
      sender: {
        id: "2",
        name: "Alex Thompson",
        avatar: "/placeholder.svg",
      },
      timestamp: "10:30 AM",
      isSent: false,
    },
    {
      id: "2",
      content: "Hi! I'm taking Data Structures and Algorithms. How about you?",
      sender: {
        id: "1",
        name: "You",
        avatar: "/placeholder.svg",
      },
      timestamp: "10:31 AM",
      isSent: true,
    },
  ],
};

export function PeerChatInterface({ recipientId, onBack, showBackButton = true }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const isBot = recipientId === "campus-bot";

  useEffect(() => {
    // Load appropriate messages based on recipient
    if (isBot) {
      setMessages(botMessages);
    } else {
      setMessages(peerMessages[recipientId] || []);
    }
  }, [recipientId, isBot]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: {
        id: "user",
        name: "You",
        avatar: "/placeholder.svg",
      },
      timestamp: "Just now",
      isSent: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    if (isBot) {
      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          content: "I'll help match you with peers who share your interests. Could you tell me what subjects or activities you're most interested in?",
          sender: {
            id: "campus-bot",
            name: "Campus Assistant",
            avatar: "/placeholder.svg",
          },
          timestamp: "Just now",
          isSent: false,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>
            {isBot ? <Bot className="h-6 w-6" /> : "AT"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">
            {isBot ? "Campus Assistant" : "Alex Thompson"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isBot ? "AI Helper • Always Available" : "Computer Science • Junior"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.isSent ? "justify-end" : "justify-start"
              }`}
            >
              {!msg.isSent && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.sender.avatar} />
                  <AvatarFallback>
                    {isBot ? <Bot className="h-4 w-4" /> : msg.sender.name[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  msg.isSent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <span className="text-xs opacity-70">{msg.timestamp}</span>
              </div>
              {msg.isSent && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.sender.avatar} />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[2.5rem] max-h-32"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Smile className="h-5 w-5" />
            </Button>
            <Button size="icon" className="shrink-0" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
