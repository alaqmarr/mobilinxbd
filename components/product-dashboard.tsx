'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Tag, Layers, ShoppingCart, Grid } from 'lucide-react';

import { BrandForm } from './forms/brand-form';
import { SeriesForm } from './forms/series-form';
import { ModelForm } from './forms/model-form';
import { ProductForm } from './forms/product-form';
import { ProductVariantForm } from './forms/product-variant-form';

import { Brand, Series, Model, Product, ProductVariant } from '@/types';

export function ProductDashboard() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch all data from your API endpoints
      const [brandsRes, seriesRes, modelsRes, productsRes, variantsRes] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/series'),
        fetch('/api/models'),
        fetch('/api/products'),
        fetch('/api/product-variants'),
      ]);

      const [brandsData, seriesData, modelsData, productsData, variantsData] = await Promise.all([
        brandsRes.json(),
        seriesRes.json(),
        modelsRes.json(),
        productsRes.json(),
        variantsRes.json(),
      ]);

      setBrands(brandsData);
      setSeries(seriesData);
      setModels(modelsData);
      setProducts(productsData);
      setProductVariants(variantsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddBrand = async (data: { name: string; image?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
        setOpenDrawer(null);
      }
    } catch (error) {
      console.error('Error adding brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSeries = async (data: { name: string; brandId: string; image?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
        setOpenDrawer(null);
      }
    } catch (error) {
      console.error('Error adding series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = async (data: { name: string; seriesId: string; image?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
        setOpenDrawer(null);
      }
    } catch (error) {
      console.error('Error adding model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (data: { name: string; sku: string; price: number; image?: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
        setOpenDrawer(null);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProductVariant = async (data: { 
    name: string; 
    price: number; 
    stock: number; 
    productId: string; 
    modelId: string; 
    image?: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/product-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
        setOpenDrawer(null);
      }
    } catch (error) {
      console.error('Error adding product variant:', error);
    } finally {
      setLoading(false);
    }
  };

  const DrawerButton = ({ 
    id, 
    title, 
    description, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    description: string; 
    icon: any; 
    children: React.ReactNode; 
  }) => (
    <Drawer open={openDrawer === id} onOpenChange={(open:any) => setOpenDrawer(open ? id : null)}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <Icon className="w-6 h-6" />
          <span className="text-sm">{title}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Dashboard</h1>
          <p className="text-gray-600">Manage your brands, series, models, products, and variants</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <DrawerButton
            id="brand"
            title="Add Brand"
            description="Create a new brand"
            icon={Tag}
          >
            <BrandForm onSubmit={handleAddBrand} loading={loading} />
          </DrawerButton>

          <DrawerButton
            id="series"
            title="Add Series"
            description="Create a new series under a brand"
            icon={Layers}
          >
            <SeriesForm brands={brands} onSubmit={handleAddSeries} loading={loading} />
          </DrawerButton>

          <DrawerButton
            id="model"
            title="Add Model"
            description="Create a new model under a series"
            icon={Grid}
          >
            <ModelForm series={series} onSubmit={handleAddModel} loading={loading} />
          </DrawerButton>

          <DrawerButton
            id="product"
            title="Add Product"
            description="Create a new product"
            icon={Package}
          >
            <ProductForm onSubmit={handleAddProduct} loading={loading} />
          </DrawerButton>

          <DrawerButton
            id="variant"
            title="Add Variant"
            description="Create a new product variant"
            icon={ShoppingCart}
          >
            <ProductVariantForm 
              products={products} 
              models={models} 
              onSubmit={handleAddProductVariant} 
              loading={loading} 
            />
          </DrawerButton>
        </div>

        {/* Data Display */}
        <Tabs defaultValue="brands" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="brands">Brands ({brands.length})</TabsTrigger>
            <TabsTrigger value="series">Series ({series.length})</TabsTrigger>
            <TabsTrigger value="models">Models ({models.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="variants">Variants ({productVariants.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand) => (
                <Card key={brand.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {brand.image && (
                        <img src={brand.image} alt={brand.name} className="w-8 h-8 object-cover rounded" />
                      )}
                      {brand.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(brand.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="series" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {series.map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {s.image && (
                        <img src={s.image} alt={s.name} className="w-8 h-8 object-cover rounded" />
                      )}
                      {s.name}
                    </CardTitle>
                    <CardDescription>{s.brand.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {model.image && (
                        <img src={model.image} alt={model.name} className="w-8 h-8 object-cover rounded" />
                      )}
                      {model.name}
                    </CardTitle>
                    <CardDescription>
                      {model.series.brand.name} - {model.series.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(model.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {product.image && (
                        <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                      )}
                      {product.name}
                    </CardTitle>
                    <CardDescription>SKU: {product.sku}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">${product.price}</p>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="variants" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productVariants.map((variant) => (
                <Card key={variant.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {variant.image && (
                        <img src={variant.image} alt={variant.name} className="w-8 h-8 object-cover rounded" />
                      )}
                      {variant.name}
                    </CardTitle>
                    <CardDescription>
                      {variant.product.name} - {variant.model.series.brand.name} {variant.model.series.name} {variant.model.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold">${variant.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className={`font-semibold ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variant.stock}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(variant.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}