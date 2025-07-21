import { Calendar, Clock, MapPin, Users, Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  club: {
    name: string;
    image: string;
  };
  attendees: number;
  maxAttendees?: number;
  isRSVPed: boolean;
  category: string;
  isFeatured?: boolean;
}

interface EventCardProps {
  event: Event;
  onRSVP?: (eventId: string) => void;
}

export function EventCard({ event, onRSVP }: EventCardProps) {
  const isFullyBooked = event.maxAttendees && event.attendees >= event.maxAttendees;

  return (
    <Card className={cn(
      "shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1",
      event.isFeatured && "ring-2 ring-primary/20"
    )}>
      {event.isFeatured && (
        <div className="bg-gradient-primary text-primary-foreground text-xs px-3 py-1 text-center font-medium">
          ⭐ Featured Event
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {event.category}
              </Badge>
              {isFullyBooked && (
                <Badge variant="destructive" className="text-xs">
                  Full
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={event.club.image} alt={event.club.name} />
            <AvatarFallback className="text-xs">{event.club.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">by {event.club.name}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {event.date}
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            {event.time}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-primary" />
            {event.location}
          </div>
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-2 text-primary" />
            {event.attendees} attending
            {event.maxAttendees && (
              <span className="text-muted-foreground"> / {event.maxAttendees}</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button
          variant={event.isRSVPed ? "secondary" : "default"}
          className="w-full"
          onClick={() => onRSVP?.(event.id)}
          disabled={isFullyBooked && !event.isRSVPed}
        >
          {event.isRSVPed ? "RSVP'd" : isFullyBooked ? "Event Full" : "RSVP"}
        </Button>
      </CardFooter>
    </Card>
  );
}