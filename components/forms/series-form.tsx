'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Brand } from '@/types';

interface SeriesFormProps {
  brands: Brand[];
  onSubmit: (data: { name: string; brandId: string; image?: string }) => void;
  loading?: boolean;
}

export function SeriesForm({ brands, onSubmit, loading }: SeriesFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Series Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter series name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Brand</Label>
        <Select
          value={formData.brandId}
          onValueChange={(value) => setFormData({ ...formData, brandId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ImageUpload
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        disabled={loading}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Series'}
      </Button>
    </form>
  );
}