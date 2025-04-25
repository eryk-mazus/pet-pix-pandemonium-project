
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfile, getPosts } from "@/services/dataService";
import type { User, Post } from "@/services/dataService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Bookmark, Heart, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!username) return;
    
    // In a real app, these would be API calls
    setLoading(true);
    
    // Example of LFI vulnerability with direct parameter usage
    // In a real app, this would be dangerous
    const fetchedUser = getUserProfile(username);
    
    // Get posts for this user
    const allPosts = getPosts();
    const userPosts = allPosts.filter(post => post.username === username);
    
    if (fetchedUser) {
      setUser(fetchedUser);
      setPosts(userPosts);
    } else {
      toast({
        variant: "destructive",
        title: "User not found",
        description: "The profile you're looking for doesn't exist.",
      });
    }
    
    setLoading(false);
  }, [username, toast]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-t-petpurple border-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
          <p className="text-gray-500 mb-4">The profile you're looking for doesn't exist.</p>
          <Link to="/" className="text-petblue-dark hover:underline">Return to feed</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10 mb-8">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage src={user.profilePicture} alt={user.displayName} />
          <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow mt-4 md:mt-0 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <h1 className="text-xl font-semibold">{user.username}</h1>
            <Button variant="outline" className="bg-white">Follow</Button>
          </div>
          
          <div className="flex justify-center md:justify-start space-x-6 my-4">
            <div>
              <span className="font-semibold">{posts.length}</span> posts
            </div>
            <div>
              <span className="font-semibold">124</span> followers
            </div>
            <div>
              <span className="font-semibold">45</span> following
            </div>
          </div>
          
          <div>
            <h2 className="font-semibold">{user.displayName}</h2>
            <p className="mt-1">{user.bio}</p>
          </div>
        </div>
      </div>
      
      {/* Posts Grid */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1">
            <Grid3X3 className="w-4 h-4 mr-2" /> Posts
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1">
            <Bookmark className="w-4 h-4 mr-2" /> Saved
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {posts.map(post => (
                <Link 
                  key={post.id} 
                  to={`/post/${post.id}`} 
                  className="aspect-square relative group"
                >
                  <img 
                    src={post.imageUrl} 
                    alt={post.caption} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Heart className="w-5 h-5 mr-1 fill-white" />
                        {post.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-1" />
                        {post.comments.length}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-xl mb-2">No Posts Yet</h3>
              <p className="text-gray-500">When {user.username} posts, you'll see their photos here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-8">
            <h3 className="text-xl mb-2">No Saved Posts</h3>
            <p className="text-gray-500">Save posts to see them here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
