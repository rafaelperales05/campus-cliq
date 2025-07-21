import { useState } from "react";
import { Calendar, Filter, Plus, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCard } from "@/components/events/EventCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockEvents = [
  {
    id: "1",
    title: "Spring Hackathon 2024",
    description: "48-hour coding marathon with amazing prizes and networking opportunities with tech companies. Build innovative solutions and compete for $10,000 in prizes!",
    date: "March 15-17, 2024",
    time: "6:00 PM - 6:00 PM",
    location: "Engineering Building",
    club: {
      name: "CS Club",
      image: "/placeholder.svg"
    },
    attendees: 124,
    maxAttendees: 150,
    isRSVPed: true,
    category: "Technology",
    isFeatured: true
  },
  {
    id: "2",
    title: "Career Fair Prep Workshop",
    description: "Learn how to write compelling resumes and ace your interviews with industry professionals.",
    date: "March 8, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Student Center",
    club: {
      name: "Career Services",
      image: "/placeholder.svg"
    },
    attendees: 67,
    maxAttendees: 80,
    isRSVPed: false,
    category: "Professional"
  },
  {
    id: "3",
    title: "Campus Cleanup Day",
    description: "Join us for a community service event to beautify our campus and promote sustainability.",
    date: "March 22, 2024",
    time: "9:00 AM - 12:00 PM",
    location: "Main Quad",
    club: {
      name: "Sustainability Club",
      image: "/placeholder.svg"
    },
    attendees: 89,
    isRSVPed: true,
    category: "Community Service"
  },
  {
    id: "4",
    title: "Photography Exhibition Opening",
    description: "Showcase of student photography work from the past semester. Reception and awards ceremony included.",
    date: "March 30, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Arts Gallery",
    club: {
      name: "Photography Society",
      image: "/placeholder.svg"
    },
    attendees: 45,
    isRSVPed: false,
    category: "Arts"
  },
  {
    id: "5",
    title: "Gaming Tournament Finals",
    description: "Epic conclusion to our semester-long esports tournament featuring multiple game titles and live streaming.",
    date: "April 5, 2024",
    time: "1:00 PM - 8:00 PM",
    location: "Gaming Lounge",
    club: {
      name: "Gaming Society",
      image: "/placeholder.svg"
    },
    attendees: 156,
    maxAttendees: 200,
    isRSVPed: true,
    category: "Gaming"
  },
  {
    id: "6",
    title: "Debate Championship",
    description: "Annual inter-university debate competition featuring teams from across the region.",
    date: "April 12, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Auditorium",
    club: {
      name: "Debate Team",
      image: "/placeholder.svg"
    },
    attendees: 78,
    maxAttendees: 300,
    isRSVPed: false,
    category: "Academic"
  }
];

const categories = ["All", "Technology", "Arts", "Professional", "Academic", "Sports", "Community Service", "Gaming"];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const myEvents = mockEvents.filter(event => event.isRSVPed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Campus Events
          </h1>
          <p className="text-muted-foreground">
            Discover and join exciting events happening on campus
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">{filteredEvents.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-university-purple mr-3" />
              <div>
                <p className="text-2xl font-bold">{myEvents.length}</p>
                <p className="text-sm text-muted-foreground">My Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-university-gold mr-3" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Venues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search events by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Dates</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="my">My Events</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setDateFilter("All");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {myEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {myEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't RSVP'd to any events yet.</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Discover Events
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.filter(event => event.isFeatured).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}