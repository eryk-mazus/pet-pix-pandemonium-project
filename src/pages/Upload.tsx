
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "@/services/dataService";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Example of insecure file upload that doesn't properly validate file type
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Example of insecure file upload that doesn't properly validate file type
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to upload.",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Example of insecure file upload with no server-side validation
      const newPost = uploadImage(selectedFile, caption);
      
      toast({
        title: "Post created!",
        description: "Your post has been published.",
      });
      
      // Navigate to the new post
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem uploading your image. Please try again.",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
        
        <form onSubmit={handleSubmit}>
          {!preview ? (
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Image size={48} className="text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Drag photos here</p>
              <p className="text-sm text-gray-500 mb-4">or click to select from your device</p>
              <Button type="button" variant="outline">
                Select from computer
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-96 rounded-lg mx-auto mb-4"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white rounded-full p-1"
                onClick={clearSelectedFile}
              >
                <X size={18} />
              </Button>
            </div>
          )}
          
          {preview && (
            <div className="mt-6">
              <Label htmlFor="caption" className="block mb-2">
                Caption
              </Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="min-h-32"
              />
              
              <div className="mt-6 flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={clearSelectedFile}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!selectedFile || isUploading}
                  className="bg-petpurple hover:bg-petpurple-dark"
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Uploading...
                    </>
                  ) : (
                    "Share"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Upload;
