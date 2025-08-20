'use client';

import { useState } from 'react';
import { getCldImageUrl } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your_preset'
    );

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setUploading(false);
      const response = JSON.parse(xhr.responseText);
      if (xhr.status === 200 && response.public_id) {
        const imageUrl = getCldImageUrl({
          src: response.public_id,
          width: 500,
          crop: 'scale',
          quality: 'auto',
        });

        onChange(imageUrl);
        toast.success('Uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      toast.error('Upload error');
    };

    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      true
    );
    xhr.send(formData);
  };

  return (
    <div className="space-y-4">
      <Label>Image</Label>

      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded"
            className="w-4 h-4 object-cover rounded-lg"
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
          className={`flex items-center gap-2 cursor-pointer bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md ${
            uploading && 'opacity-50 cursor-not-allowed'
          }`}
        >
          <Upload className="w-4 h-4" />
          {uploading ? `Uploading (${progress}%)` : 'Upload Image'}
        </Label>
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
