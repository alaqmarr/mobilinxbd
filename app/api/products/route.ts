import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, sku, price, image } = await request.json();
    
    if (!name || !sku || price === undefined) {
      return NextResponse.json(
        { error: 'Product name, SKU, and price are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: { name, sku, price, image },
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error:any) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}