
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { likePost, addComment } from "@/services/dataService";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PostCardProps {
  id: string;
  username: string;
  userProfilePic: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
  comments: {
    id: string;
    username: string;
    text: string;
  }[];
  showComments?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  username,
  userProfilePic,
  imageUrl,
  caption,
  likes: initialLikes,
  timestamp,
  comments,
  showComments = false,
  className = "",
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [comment, setComment] = useState("");
  const [localComments, setLocalComments] = useState(comments);
  const { toast } = useToast();

  const handleLike = () => {
    const newLikeCount = likePost(id);
    if (newLikeCount) {
      setLiked(true);
      setLikes(newLikeCount);
      toast({
        description: "Post liked!",
        duration: 2000,
      });
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    // Example of XSS vulnerability by directly rendering user input
    const newComment = addComment(id, "1", comment);
    if (newComment) {
      setLocalComments([...localComments, newComment]);
      setComment("");
    }
  };

  const formattedDate = new Date(timestamp).toLocaleDateString();

  return (
    <Card className={`overflow-hidden mb-6 ${className}`}>
      <div className="flex items-center p-4">
        <Link to={`/profile/${username}`} className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={userProfilePic} alt={username} />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{username}</span>
        </Link>
        <span className="ml-auto text-sm text-gray-500">{formattedDate}</span>
      </div>
      
      <Link to={`/post/${id}`}>
        <div className="relative aspect-square">
          <img 
            src={imageUrl} 
            alt="Post" 
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/500?text=Image+Not+Found";
            }}
          />
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <Button 
            variant="ghost" 
            className="p-0 h-auto hover:bg-transparent" 
            onClick={handleLike}
          >
            <Heart 
              size={24} 
              className={`${liked ? 'fill-red-500 text-red-500' : 'text-gray-700'} transition-all ${liked ? 'animate-heart-beat' : ''}`} 
            />
          </Button>
          <Link to={`/post/${id}`}>
            <MessageCircle size={24} className="text-gray-700" />
          </Link>
          <Share2 size={24} className="text-gray-700" />
          <Bookmark size={24} className="ml-auto text-gray-700" />
        </div>
        
        <div className="mb-2">
          <span className="font-semibold">{likes} likes</span>
        </div>
        
        <div className="mb-2">
          <span className="font-semibold">{username} </span>
          {/* Deliberately insecure: direct HTML rendering of caption */}
          <span dangerouslySetInnerHTML={{ __html: caption }} />
        </div>
        
        {(showComments || localComments.length < 3) && (
          <div className="text-sm">
            {localComments.map((comment) => (
              <div key={comment.id} className="mb-1">
                <span className="font-semibold">{comment.username} </span>
                {/* Deliberate XSS vulnerability: innerHTML instead of safe rendering */}
                <span dangerouslySetInnerHTML={{ __html: comment.text }} />
              </div>
            ))}
          </div>
        )}
        
        {!showComments && localComments.length > 2 && (
          <Link to={`/post/${id}`} className="block text-gray-500 text-sm">
            View all {localComments.length} comments
          </Link>
        )}
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleComment} className="flex w-full">
          <Input
            className="flex-grow bg-transparent border-none focus-visible:ring-0 p-0 h-auto shadow-none"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            className={`p-0 font-semibold ${!comment.trim() ? 'text-blue-300' : 'text-petblue-dark'}`}
            disabled={!comment.trim()}
          >
            Post
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
