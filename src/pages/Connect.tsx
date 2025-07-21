import { useState } from "react";
import { ArrowLeft, Bot, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PeerCard } from "@/components/social/PeerConnect/PeerCard";
import { PeerChatInterface } from "@/components/social/PeerConnect/PeerChatInterface";

const campusBot = {
  id: "campus-bot",
  name: "Campus Assistant",
  avatar: "/placeholder.svg",
  major: "AI Helper",
  year: "24/7",
  interests: ["Matching", "Campus Info", "Support"],
  isBot: true,
};

const mockPeers = [
  {
    id: "1",
    name: "Alex Thompson",
    avatar: "/placeholder.svg",
    major: "Computer Science",
    year: "Junior",
    interests: ["Programming", "AI", "Robotics"],
    lastMessage: "Hey! Are you also taking CS350?",
    timestamp: "2h ago",
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    major: "Business Administration",
    year: "Senior",
    interests: ["Marketing", "Entrepreneurship"],
    lastMessage: "Thanks for the club meeting info!",
    timestamp: "1d ago",
    isOnline: false,
  },
];

export default function Connect() {
  const [selectedChat, setSelectedChat] = useState<string>("campus-bot");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPeers = [campusBot, ...mockPeers].filter(
    (peer) =>
      peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.major.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left sidebar - Chat list */}
      <div className={`w-full md:w-80 border-r flex-shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'} flex-col`}>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search messages..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {filteredPeers.map((peer) => (
              <div
                key={peer.id}
                onClick={() => setSelectedChat(peer.id)}
                className={`cursor-pointer transition-colors ${
                  selectedChat === peer.id ? 'bg-muted' : 'hover:bg-muted/50'
                } rounded-lg`}
              >
                <PeerCard
                  peer={peer}
                  variant="compact"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right side - Chat interface or welcome screen */}
      <div className={`flex-1 ${!selectedChat ? 'hidden md:flex' : 'flex'} flex-col`}>
        {selectedChat ? (
          <PeerChatInterface
            recipientId={selectedChat}
            onBack={() => setSelectedChat("")}
            showBackButton={true}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <Bot className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-semibold">Welcome to Campus Connect</h3>
              <p className="text-muted-foreground max-w-md">
                Start chatting with our Campus Assistant to find peers, join study groups,
                or get matched with students sharing your interests.
              </p>
              <Button onClick={() => setSelectedChat("campus-bot")}>
                Chat with Campus Assistant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}