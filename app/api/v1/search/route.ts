import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';

    const [brands, series, models, products, variants] = await Promise.all([
      prisma.brand.findMany(),
      prisma.series.findMany(),
      prisma.models.findMany(),
      prisma.product.findMany(),
      prisma.productVariant.findMany(),
    ]);

    return NextResponse.json({
      brands: brands.filter(b => b.name.toLowerCase().includes(q)),
      series: series.filter(s => s.name.toLowerCase().includes(q)),
      models: models.filter(m => m.name.toLowerCase().includes(q)),
      products: products.filter(p =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      ),
      variants: variants.filter(v => v.name.toLowerCase().includes(q)),
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
