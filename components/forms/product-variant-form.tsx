'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Product, Model } from '@/types';

interface ProductVariantFormProps {
  products: Product[];
  models: Model[];
  onSubmit: (data: { 
    name: string; 
    price: number; 
    stock: number; 
    productId: string; 
    modelId: string; 
    image?: string;
  }) => void;
  loading?: boolean;
}

export function ProductVariantForm({ products, models, onSubmit, loading }: ProductVariantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    productId: '',
    modelId: '',
    image: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Variant Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e:any) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter variant name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Product</Label>
        <Select
          value={formData.productId}
          onValueChange={(value:any) => setFormData({ ...formData, productId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Model</Label>
        <Select
          value={formData.modelId}
          onValueChange={(value:any) => setFormData({ ...formData, modelId: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.series.brand.name} - {model.series.name} - {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e:any) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          placeholder="Enter price"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={(e:any) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
          placeholder="Enter stock quantity"
          required
        />
      </div>

      <ImageUpload
        value={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
        disabled={loading}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding...' : 'Add Product Variant'}
      </Button>
    </form>
  );
}