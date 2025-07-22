import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, TrendingUp, Users, Calendar, Shield, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PostCard } from "@/components/social/PostCard";
import { EventCard } from "@/components/events/EventCard";
import { Badge } from "@/components/ui/badge";
import { AdminRequestForm } from "@/components/admin/AdminRequestForm";
import { useAuth } from "@/contexts/AuthContext";
import { sanitizeUserContent } from "@/lib/sanitize";

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

const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Post cannot be empty')
    .max(1000, 'Post must be less than 1000 characters'),
});

type PostFormData = z.infer<typeof postSchema>;

export default function Dashboard() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [showAdminRequest, setShowAdminRequest] = useState(false);
  const { user, isAdmin, hasRole } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormData) => {
    setApiError(null); // Clear previous API errors
    try {
      const sanitizedContent = sanitizeUserContent(data.content);
      console.log('Posting sanitized content:', sanitizedContent);

      // TODO: Replace with your actual API call
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: sanitizedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post.');
      }

      toast.success('Post created successfully!');
      reset({ content: '' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred.';
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Show admin request form if requested
  if (showAdminRequest) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Request Admin Privileges</h1>
          <Button variant="outline" onClick={() => setShowAdminRequest(false)}>
            Back to Dashboard
          </Button>
        </div>
        <AdminRequestForm onSuccess={() => setShowAdminRequest(false)} />
      </div>
    );
  }

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
            {/* Display API error if it exists */}
            {apiError && (
              <Alert variant="destructive">
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Textarea
                placeholder="What's on your mind? Share updates, ask questions, or start a discussion..."
                className="min-h-20 resize-none"
                {...register('content')}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Badge variant="outline" className="text-xs">Computer Science</Badge>
                  <Badge variant="outline" className="text-xs">Junior</Badge>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </form>
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

        {/* Role-based Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Super Admin Exclusive Actions */}
            {hasRole('superAdmin') && (
              <>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Moderate Content
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </>
            )}
            
            {/* Actions for Club Admins and above */}
            {hasRole('clubAdmin') && (
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
            
            {/* Actions for Students only */}
            {user?.role === 'student' && (
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => setShowAdminRequest(true)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Request Admin Role
              </Button>
            )}
            
            {/* Universal Actions */}
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}