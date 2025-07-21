import { useState } from "react";
import { Search, Filter, Plus, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClubCard } from "@/components/clubs/ClubCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockClubs = [
  {
    id: "1",
    name: "Computer Science Club",
    description: "A community for CS students to learn, collaborate, and build amazing projects together. We organize hackathons, tech talks, and coding workshops.",
    category: "Technology",
    memberCount: 234,
    upcomingEvents: 3,
    isJoined: true,
    image: "/placeholder.svg",
    location: "Engineering Building",
    rating: 4.8
  },
  {
    id: "2",
    name: "Sustainability Club",
    description: "Dedicated to making our campus and community more environmentally friendly through initiatives, education, and activism.",
    category: "Environmental",
    memberCount: 156,
    upcomingEvents: 2,
    isJoined: false,
    image: "/placeholder.svg",
    location: "Student Center",
    rating: 4.6
  },
  {
    id: "3",
    name: "Photography Society",
    description: "Capturing moments and developing skills through workshops, photo walks, and exhibitions. All skill levels welcome!",
    category: "Arts",
    memberCount: 89,
    upcomingEvents: 1,
    isJoined: true,
    image: "/placeholder.svg",
    location: "Arts Building",
    rating: 4.7
  },
  {
    id: "4",
    name: "Business Innovation Club",
    description: "Fostering entrepreneurial spirit through case competitions, networking events, and startup incubator programs.",
    category: "Business",
    memberCount: 178,
    upcomingEvents: 4,
    isJoined: false,
    image: "/placeholder.svg",
    location: "Business School",
    rating: 4.5
  },
  {
    id: "5",
    name: "Gaming Society",
    description: "Unite gamers across all platforms for tournaments, LAN parties, and casual gaming sessions. From retro to modern!",
    category: "Gaming",
    memberCount: 267,
    upcomingEvents: 5,
    isJoined: true,
    image: "/placeholder.svg",
    location: "Student Lounge",
    rating: 4.9
  },
  {
    id: "6",
    name: "Debate Team",
    description: "Sharpen your argumentation and public speaking skills while competing in regional and national tournaments.",
    category: "Academic",
    memberCount: 45,
    upcomingEvents: 2,
    isJoined: false,
    image: "/placeholder.svg",
    location: "Liberal Arts Building",
    rating: 4.4
  }
];

const categories = ["All", "Technology", "Arts", "Business", "Academic", "Sports", "Environmental", "Gaming"];

export default function Clubs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredClubs = mockClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const myClubs = mockClubs.filter(club => club.isJoined);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Discover Clubs
          </h1>
          <p className="text-muted-foreground">
            Find your community and connect with like-minded students
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Club
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search clubs by name or description..."
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
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-96">
          <TabsTrigger value="all">All Clubs ({filteredClubs.length})</TabsTrigger>
          <TabsTrigger value="my">My Clubs ({myClubs.length})</TabsTrigger>
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

          {/* Clubs Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {filteredClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>

          {filteredClubs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No clubs found matching your criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="space-y-6">
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {myClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>

          {myClubs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't joined any clubs yet.</p>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Discover Clubs
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}