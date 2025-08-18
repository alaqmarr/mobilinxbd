import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET all variants OR filter by modelId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');

    const variants = await prisma.productVariant.findMany({
      where: modelId ? { modelId } : {},
      orderBy: { createdAt: 'desc' },
      include: { product: true, model: true },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json({ error: 'Failed to fetch product variants' }, { status: 500 });
  }
}

// POST → create variant
export async function POST(request: Request) {
  try {
    const { name, image, price, stock, productId, modelId } = await request.json();

    if (!name || !productId || !modelId || price == null) {
      return NextResponse.json({ error: 'Name, productId, modelId, and price are required' }, { status: 400 });
    }

    const variant = await prisma.productVariant.create({
      data: { name, image, price, stock, productId, modelId },
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error('Error creating product variant:', error);
    return NextResponse.json({ error: 'Failed to create product variant' }, { status: 500 });
  }
}
