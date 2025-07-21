import { useState } from "react";
import { Plus, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PostCard } from "@/components/social/PostCard";
import { EventCard } from "@/components/events/EventCard";
import { Badge } from "@/components/ui/badge";

const mockPosts = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      major: "Computer Science",
      year: "Junior"
    },
    content: "Just finished an amazing workshop on React development! The CS Club really knows how to organize engaging events. Can't wait for the next hackathon! 🚀",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    club: {
      name: "CS Club",
      color: "blue"
    },
    isLiked: false
  },
  {
    id: "2",
    author: {
      name: "Marcus Johnson",
      avatar: "/placeholder.svg",
      major: "Business Administration",
      year: "Senior"
    },
    content: "Looking for study partners for the upcoming midterms! Anyone in the Business program interested in forming a study group? Drop me a message!",
    timestamp: "4 hours ago",
    likes: 12,
    comments: 15,
    isLiked: true
  },
  {
    id: "3",
    author: {
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg",
      major: "Environmental Science",
      year: "Sophomore"
    },
    content: "The Sustainability Club's campus cleanup was a huge success! We collected over 200 pounds of recyclables. Thanks to everyone who participated! 🌱",
    timestamp: "1 day ago",
    likes: 45,
    comments: 12,
    club: {
      name: "Sustainability Club",
      color: "green"
    },
    isLiked: false
  }
];

const upcomingEvents = [
  {
    id: "1",
    title: "Spring Hackathon 2024",
    description: "48-hour coding marathon with amazing prizes and networking opportunities with tech companies.",
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
  }
];

export default function Dashboard() {
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (newPost.trim()) {
      // Handle posting logic here
      setNewPost("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        {/* Create Post */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Share with your community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share updates, ask questions, or start a discussion..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-20 resize-none"
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-xs">Computer Science</Badge>
                <Badge variant="outline" className="text-xs">Junior</Badge>
              </div>
              <Button onClick={handlePost} disabled={!newPost.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Your Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Clubs Joined</span>
              </div>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Events Attended</span>
              </div>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Posts This Month</span>
              </div>
              <span className="font-semibold">8</span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}