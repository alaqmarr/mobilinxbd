'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_preset');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        onChange(data.secure_url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Image</Label>
      
      {value && (
        <div className="relative">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onChange('')}
            disabled={disabled}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          disabled={disabled || uploading}
          className="hidden"
          id="image-upload"
        />
        <Label
          htmlFor="image-upload"
          className="flex items-center gap-2 cursor-pointer bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Label>
      </div>
    </div>
  );
}
