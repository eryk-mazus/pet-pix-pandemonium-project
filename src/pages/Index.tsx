
import React, { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/services/dataService";
import type { Post } from "@/services/dataService";
import { Skeleton } from "@/components/ui/skeleton";

const Index: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading delay
    const loadData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        setTimeout(() => {
          const fetchedPosts = getPosts();
          setPosts(fetchedPosts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="py-4">
      <h1 className="sr-only">Pet-stagram Feed</h1>
      
      {loading ? (
        // Loading skeletons
        Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-28 ml-2" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
            <Skeleton className="h-96 w-full" />
            <div className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            username={post.username}
            userProfilePic={post.userProfilePic}
            imageUrl={post.imageUrl}
            caption={post.caption}
            likes={post.likes}
            timestamp={post.timestamp}
            comments={post.comments}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">No posts yet</h2>
          <p className="text-gray-500">Follow some pet accounts to see their posts here!</p>
        </div>
      )}
    </div>
  );
};

export default Index;
