import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const productVariants = await prisma.productVariant.findMany({
      include: {
        product: true,
        model: {
          include: {
            series: {
              include: {
                brand: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(productVariants);
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product variants' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, stock, productId, modelId, image } = await request.json();
    
    if (!name || price === undefined || stock === undefined || !productId || !modelId) {
      return NextResponse.json(
        { error: 'All fields except image are required' },
        { status: 400 }
      );
    }

    const productVariant = await prisma.productVariant.create({
      data: { name, price, stock, productId, modelId, image },
      include: {
        product: true,
        model: {
          include: {
            series: {
              include: {
                brand: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json(productVariant, { status: 201 });
  } catch (error) {
    console.error('Error creating product variant:', error);
    return NextResponse.json(
      { error: 'Failed to create product variant' },
      { status: 500 }
    );
  }
}