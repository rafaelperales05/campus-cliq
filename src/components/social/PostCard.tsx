import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sanitizeUserContent } from "@/lib/sanitize";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    major: string;
    year: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  club?: {
    name: string;
    color: string;
  };
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <Card className="shadow-card hover:shadow-elegant transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-sm">{post.author.name}</h4>
                {post.club && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {post.club.name}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {post.author.major} • {post.author.year} • {post.timestamp}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div 
          className="text-sm mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: sanitizeUserContent(post.content) 
          }}
        />
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center space-x-1 transition-colors",
                isLiked && "text-red-500 hover:text-red-600"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span className="text-xs">{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{post.comments}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}