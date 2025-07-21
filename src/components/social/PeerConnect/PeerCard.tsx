import { User, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface PeerCardProps {
  peer: {
    id: string;
    name: string;
    avatar: string;
    major: string;
    year: string;
    interests: string[];
    isOnline?: boolean;
    isBot?: boolean;
    lastMessage?: string;
    timestamp?: string;
  };
  variant?: "full" | "compact";
  onClick?: () => void;
}

export function PeerCard({ peer, variant = "full", onClick }: PeerCardProps) {
  if (variant === "compact") {
    return (
      <div 
        className="p-3 flex items-center gap-3 rounded-lg"
        onClick={onClick}
      >
        <Avatar className="relative h-12 w-12">
          <AvatarImage src={peer.avatar} alt={peer.name} />
          <AvatarFallback>
            {peer.isBot ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
          </AvatarFallback>
          {peer.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-medium truncate">{peer.name}</h4>
            {peer.timestamp && (
              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                {peer.timestamp}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-sm text-muted-foreground truncate">
              {peer.lastMessage || peer.major}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow duration-200",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="relative h-10 w-10">
            <AvatarImage src={peer.avatar} alt={peer.name} />
            <AvatarFallback>
              {peer.isBot ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
            </AvatarFallback>
            {peer.isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
            )}
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{peer.name}</h4>
              <span className="text-sm text-muted-foreground">{peer.year}</span>
            </div>
            <p className="text-sm text-muted-foreground">{peer.major}</p>
            <ScrollArea className="max-w-full">
              <div className="flex gap-2">
                {peer.interests.map((interest) => (
                  <span key={interest} className="text-xs bg-muted px-2 py-0.5 rounded">
                    {interest}
                  </span>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 


