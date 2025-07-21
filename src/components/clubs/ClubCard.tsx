import { Users, Calendar, MapPin, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  upcomingEvents: number;
  isJoined: boolean;
  image: string;
  location: string;
  rating: number;
}

interface ClubCardProps {
  club: Club;
  onJoin?: (clubId: string) => void;
}

export function ClubCard({ club, onJoin }: ClubCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={club.image} alt={club.name} />
            <AvatarFallback>{club.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{club.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {club.category}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="w-3 h-3 mr-1 fill-current text-university-gold" />
                {club.rating}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {club.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            {club.memberCount} members
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {club.upcomingEvents} upcoming events
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            {club.location}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button
          variant={club.isJoined ? "secondary" : "default"}
          className="w-full"
          onClick={() => onJoin?.(club.id)}
        >
          {club.isJoined ? "Joined" : "Join Club"}
        </Button>
      </CardFooter>
    </Card>
  );
}