
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostById, addComment } from "@/services/dataService";
import type { Post } from "@/services/dataService";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    // In a real app, this would be an API call
    setLoading(true);
    setTimeout(() => {
      const fetchedPost = getPostById(id);
      if (fetchedPost) {
        setPost(fetchedPost);
      } else {
        toast({
          variant: "destructive",
          title: "Post not found",
          description: "The post you're looking for doesn't exist.",
        });
      }
      setLoading(false);
    }, 500);
  }, [id, toast]);

  const handleLike = () => {
    if (!post) return;
    
    setLiked(true);
    setPost({
      ...post,
      likes: post.likes + 1,
    });
    
    toast({
      description: "Post liked!",
      duration: 2000,
    });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !post || !id) return;
    
    // Example of XSS vulnerability by directly rendering user input
    const newComment = addComment(id, "1", comment);
    if (newComment) {
      setPost({
        ...post,
        comments: [...post.comments, newComment],
      });
      setComment("");
      
      toast({
        description: "Comment added!",
        duration: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-t-petpurple border-t-4 border-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <p className="text-gray-500 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-petblue-dark hover:underline">Return to feed</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.timestamp).toLocaleDateString();

  return (
    <div className="py-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
        {/* Image Section */}
        <div className="md:w-2/3 bg-gray-100">
          <div className="relative aspect-square w-full">
            <img
              src={post.imageUrl}
              alt="Post"
              className="object-contain w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/800?text=Image+Not+Found";
              }}
            />
          </div>
        </div>
        
        {/* Content Section */}
        <div className="md:w-1/3 flex flex-col">
          {/* Header */}
          <div className="p-4 flex items-center border-b">
            <Link to={`/profile/${post.username}`} className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={post.userProfilePic} alt={post.username} />
                <AvatarFallback>{post.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{post.username}</span>
            </Link>
            <span className="ml-auto text-sm text-gray-500">{formattedDate}</span>
          </div>
          
          {/* Comments */}
          <div className="flex-grow overflow-y-auto p-4">
            {/* Caption */}
            <div className="flex items-start space-x-2 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={post.userProfilePic} alt={post.username} />
                <AvatarFallback>{post.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-semibold">{post.username} </span>
                {/* Deliberately insecure: direct HTML rendering of caption */}
                <span dangerouslySetInnerHTML={{ __html: post.caption }} />
              </div>
            </div>
            
            {/* Comments list */}
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{comment.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold">{comment.username} </span>
                    {/* Deliberate XSS vulnerability: innerHTML instead of safe rendering */}
                    <span dangerouslySetInnerHTML={{ __html: comment.text }} />
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="p-4 border-t">
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
              <MessageCircle size={24} className="text-gray-700" />
              <Share2 size={24} className="text-gray-700" />
              <Bookmark size={24} className="ml-auto text-gray-700" />
            </div>
            
            <div className="mb-4">
              <span className="font-semibold">{post.likes} likes</span>
            </div>
            
            <Separator className="mb-4" />
            
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
