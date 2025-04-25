
// Mock data service - in a real app, this would be API calls
import { toast } from "@/components/ui/use-toast";

export interface User {
  id: string;
  username: string;
  displayName: string;
  profilePicture: string;
  bio: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userProfilePic: string;
  imageUrl: string;
  caption: string;
  likes: number;
  timestamp: string;
  comments: Comment[];
}

// Mock data
const users: User[] = [
  {
    id: "1",
    username: "fluffycat",
    displayName: "Fluffy Cat",
    profilePicture: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    bio: "Just a fluffy cat living my best nine lives. Meow!",
  },
  {
    id: "2",
    username: "goodboy",
    displayName: "Good Boy",
    profilePicture: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    bio: "Woof! I chase balls and give lots of love.",
  },
  {
    id: "3",
    username: "hamsterdance",
    displayName: "Hammy",
    profilePicture: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    bio: "Small but mighty. I run on my wheel all night long!",
  },
];

const posts: Post[] = [
  {
    id: "1",
    userId: "1",
    username: "fluffycat",
    userProfilePic: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    caption: "Just lounging around today #lazycat #naptime",
    likes: 42,
    timestamp: "2023-04-15T14:30:00Z",
    comments: [
      {
        id: "c1",
        postId: "1",
        userId: "2",
        username: "goodboy",
        text: "Looking cozy!",
        timestamp: "2023-04-15T15:00:00Z",
      },
    ],
  },
  {
    id: "2",
    userId: "2",
    username: "goodboy",
    userProfilePic: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    imageUrl: "https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    caption: "Beach day with my human! #beachdog #sunshine",
    likes: 76,
    timestamp: "2023-04-14T10:15:00Z",
    comments: [],
  },
  {
    id: "3",
    userId: "3",
    username: "hamsterdance",
    userProfilePic: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    imageUrl: "https://images.unsplash.com/photo-1599153253655-d3427b700e3f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    caption: "New toy day is the best day! #hamsterlife #wheel",
    likes: 31,
    timestamp: "2023-04-13T18:45:00Z",
    comments: [
      {
        id: "c2",
        postId: "3",
        userId: "1",
        username: "fluffycat",
        text: "So tiny and cute!",
        timestamp: "2023-04-13T19:20:00Z",
      },
      {
        id: "c3",
        postId: "3",
        userId: "2",
        username: "goodboy",
        text: "Looks fun!",
        timestamp: "2023-04-14T08:10:00Z",
      },
    ],
  },
];

// Example of SQL injection vulnerability in a mock service
export const getPosts = () => {
  return posts;
};

export const getPostById = (id: string) => {
  return posts.find(post => post.id === id);
};

// Simulated SQL Injection vulnerability (educational purposes only)
export const searchPosts = (query: string) => {
  // In a real app with a SQL database, this would be vulnerable to injection
  console.log(`SELECT * FROM posts WHERE caption LIKE '%${query}%'`);
  return posts.filter(post => post.caption.toLowerCase().includes(query.toLowerCase()));
};

// Example of Local File Inclusion vulnerability (educational purposes only)
export const getUserProfile = (username: string) => {
  // In a real app, this kind of direct parameter use could lead to LFI
  console.log(`Reading user profile from: /user/profiles/${username}.json`);
  
  // Simulate reading a file, but actually just return from our mock data
  return users.find(user => user.username === username);
};

// Example of a function with insecure file upload handling
export const uploadImage = (file: File, caption: string) => {
  // Simulating insecure file upload that doesn't validate file type properly
  // In a real app, this would be vulnerable
  
  // Create a new post with the uploaded image
  const newPost = {
    id: `${posts.length + 1}`,
    userId: "1", // Assume current user is fluffycat
    username: "fluffycat",
    userProfilePic: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    imageUrl: URL.createObjectURL(file), // Using blob URL for demo
    caption: caption,
    likes: 0,
    timestamp: new Date().toISOString(),
    comments: [],
  };

  posts.unshift(newPost);
  return newPost;
};

export const addComment = (postId: string, userId: string, text: string) => {
  const post = posts.find(p => p.id === postId);
  if (!post) return null;
  
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  
  const newComment = {
    id: `c${Date.now()}`,
    postId,
    userId,
    username: user.username,
    text,
    timestamp: new Date().toISOString()
  };
  
  post.comments.push(newComment);
  return newComment;
};

export const likePost = (postId: string) => {
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.likes += 1;
    return post.likes;
  }
  return null;
};
