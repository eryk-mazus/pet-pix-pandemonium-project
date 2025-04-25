
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, PlusSquare, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Example of XSS vulnerability (unsafely rendering user input)
    const resultElement = document.createElement("div");
    resultElement.innerHTML = `<span>Searching for: ${searchQuery}</span>`;
    document.getElementById("search-results")?.appendChild(resultElement);
    
    toast({
      title: "Search Results",
      description: `Searching for ${searchQuery}`,
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
      <div className="container flex items-center justify-between max-w-4xl p-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-petpink-dark to-petpurple-dark text-transparent bg-clip-text">Pet-stagram</span>
        </Link>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-xs mx-4">
          <input
            type="text"
            placeholder="Search pets..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-petpurple"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div id="search-results" className="absolute z-20 w-full bg-white shadow-lg rounded-md mt-1"></div>
        </form>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="p-1 text-gray-700 hover:text-petpurple-dark">
            <Home size={24} />
          </Link>
          <Link to="/upload" className="p-1 text-gray-700 hover:text-petpurple-dark">
            <PlusSquare size={24} />
          </Link>
          <Link to="/profile/user123" className="p-1 text-gray-700 hover:text-petpurple-dark">
            <User size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
