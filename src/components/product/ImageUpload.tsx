import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  previewUrl?: string | null;
  className?: string;
}

export function ImageUpload({ onChange, value, previewUrl, className }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    
    if (!file) {
      onChange(null);
      setLocalPreview(null);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError("File must be an image (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be less than 8MB");
      return;
    }

    // Create a preview URL
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);

    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(preview);
      if (img.width < 500 || img.height < 500) {
        setError("Image must be at least 500x500 pixels");
        setLocalPreview(null);
        onChange(null);
      } else {
        onChange(file);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(preview);
      setError("Failed to load image");
      setLocalPreview(null);
      onChange(null);
    };
    img.src = preview;
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setLocalPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div
        onClick={handleButtonClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
          error && "border-red-500 bg-red-50"
        )}
      >
        {localPreview ? (
          <div className="relative w-full h-full">
            <img
              src={localPreview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 rounded-full bg-primary/10 p-3">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-2 text-sm font-medium">
              Drag & drop an image or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WebP or GIF (min 500x500px, max 8MB)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}