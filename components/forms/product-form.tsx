'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';

interface ProductFormProps {
  onSubmit: (data: { name: string; sku: string; price: number; image?: string }) => void;
  loading?: boolean;
}

export function ProductForm({ onSubmit, loading }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          placeholder="Enter SKU"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          placeholder="Enter price"
          required
        />
      </div>

      <ImageUpload
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        disabled={loading}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Product'}
      </Button>
    </form>
  );
}