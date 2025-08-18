import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET → Fetch productVariant by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: (await params).id },
    });

    if (!productVariant) {
      return NextResponse.json(
        { error: 'productVariant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(productVariant);
  } catch (error) {
    console.error('Error fetching productVariant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch productVariant' },
      { status: 500 }
    );
  }
}

// PUT → Update productVariant by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const { name, image } = await request.json();

    const updated = await prisma.productVariant.update({
      where: { id: (await params).id },
      data: { name, image },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating productVariant:', error);
    return NextResponse.json(
      { error: 'Failed to update productVariant' },
      { status: 500 }
    );
  }
}

// DELETE → Delete productVariant by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    await prisma.productVariant.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ message: 'productVariant deleted successfully' });
  } catch (error) {
    console.error('Error deleting productVariant:', error);
    return NextResponse.json(
      { error: 'Failed to delete productVariant' },
      { status: 500 }
    );
  }
}
