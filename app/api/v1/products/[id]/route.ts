import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET → Fetch product by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: (await params).id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT → Update product by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const { name, image } = await request.json();

    const updated = await prisma.product.update({
      where: { id: (await params).id },
      data: { name, image },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE → Delete product by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    await prisma.product.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ message: 'product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
