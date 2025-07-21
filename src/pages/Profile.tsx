import { useState } from "react";
import { Edit, MapPin, Calendar, GraduationCap, Users, Award, Settings, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const userProfile = {
  name: "Alex Thompson",
  email: "alex.thompson@university.edu",
  avatar: "/placeholder.svg",
  major: "Computer Science",
  year: "Junior",
  residence: "North Campus",
  joinDate: "September 2022",
  bio: "Passionate about technology and innovation. Love building apps that make a difference in people's lives. Always eager to learn new technologies and collaborate on exciting projects.",
  interests: ["Web Development", "AI/ML", "Hackathons", "Open Source", "Gaming"],
  stats: {
    clubsJoined: 5,
    eventsAttended: 24,
    postsCreated: 18,
    connectionsCount: 89
  }
};

const clubs = [
  { name: "Computer Science Club", role: "Member", joinDate: "Sept 2022" },
  { name: "Photography Society", role: "Vice President", joinDate: "Jan 2023" },
  { name: "Gaming Society", role: "Tournament Organizer", joinDate: "Feb 2023" },
  { name: "Sustainability Club", role: "Member", joinDate: "Sept 2023" },
  { name: "Debate Team", role: "Member", joinDate: "Jan 2024" }
];

const achievements = [
  { title: "Hackathon Winner", description: "First place in Spring Hackathon 2023", date: "March 2023" },
  { title: "Community Leader", description: "Organized 5+ successful events", date: "December 2023" },
  { title: "Active Member", description: "Attended 20+ club events", date: "January 2024" },
  { title: "Photography Excellence", description: "Best Photo Award in campus exhibition", date: "November 2023" }
];

const recentActivity = [
  { type: "event", action: "RSVP'd to Spring Hackathon 2024", time: "2 hours ago" },
  { type: "post", action: "Posted about React workshop", time: "1 day ago" },
  { type: "club", action: "Joined Debate Team", time: "2 days ago" },
  { type: "achievement", action: "Earned Community Leader badge", time: "1 week ago" }
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 text-center md:text-left">
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <p className="text-muted-foreground">{userProfile.email}</p>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-sm">
                  <GraduationCap className="w-4 h-4 mr-2 text-primary" />
                  {userProfile.major} • {userProfile.year}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  {userProfile.residence}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  Joined {userProfile.joinDate}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {userProfile.bio}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{userProfile.stats.clubsJoined}</div>
            <div className="text-sm text-muted-foreground">Clubs Joined</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-university-purple">{userProfile.stats.eventsAttended}</div>
            <div className="text-sm text-muted-foreground">Events Attended</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-university-gold">{userProfile.stats.postsCreated}</div>
            <div className="text-sm text-muted-foreground">Posts Created</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{userProfile.stats.connectionsCount}</div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="clubs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="clubs">My Clubs</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Club Memberships
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {clubs.map((club, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{club.name}</h4>
                    <p className="text-sm text-muted-foreground">{club.role} • Joined {club.joinDate}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Club
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements & Awards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Progress Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Progress to Next Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Community Engagement</span>
                  <span>75%</span>
                </div>
                <Progress value={75} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Event Participation</span>
                  <span>60%</span>
                </div>
                <Progress value={60} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Leadership Experience</span>
                  <span>40%</span>
                </div>
                <Progress value={40} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border-l-2 border-primary/30 bg-muted/30 rounded-r-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}