'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';

interface BrandFormProps {
  onSubmit: (data: { name: string; image?: string }) => void;
  loading?: boolean;
}

export function BrandForm({ onSubmit, loading }: BrandFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Brand Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter brand name"
          required
        />
      </div>

      <ImageUpload
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        disabled={loading}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Brand'}
      </Button>
    </form>
  );
}
