export interface Brand {
  id: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Series {
  id: string;
  name: string;
  image?: string;
  brandId: string;
  brand: Brand;
  createdAt: Date;
  updatedAt: Date;
}

export interface Model {
  id: string;
  name: string;
  image?: string;
  seriesId: string;
  series: Series;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  image?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  image?: string;
  price: number;
  stock: number;
  productId: string;
  product: Product;
  modelId: string;
  model: Model;
  createdAt: Date;
  updatedAt: Date;
}