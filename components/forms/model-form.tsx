'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Series } from '@/types';

interface ModelFormProps {
  series: Series[];
  onSubmit: (data: { name: string; seriesId: string; image?: string }) => void;
  loading?: boolean;
}

export function ModelForm({ series, onSubmit, loading }: ModelFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    seriesId: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Model Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter model name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Series</Label>
        <Select
          value={formData.seriesId}
          onValueChange={(value) => setFormData({ ...formData, seriesId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a series" />
          </SelectTrigger>
          <SelectContent>
            {series.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.brand.name} - {s.name}
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
        {loading ? 'Adding...' : 'Add Model'}
      </Button>
    </form>
  );
}