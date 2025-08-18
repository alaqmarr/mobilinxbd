import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET → Fetch models by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const models = await prisma.models.findUnique({
      where: { id: (await params).id },
      include:{
        series: {
          include: {
            brand: true,
          }
        }
      }
    });

    if (!models) {
      return NextResponse.json(
        { error: 'models not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// PUT → Update models by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const { name, image } = await request.json();

    const updated = await prisma.models.update({
      where: { id: (await params).id },
      data: { name, image },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating models:', error);
    return NextResponse.json(
      { error: 'Failed to update models' },
      { status: 500 }
    );
  }
}

// DELETE → Delete models by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    await prisma.models.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ message: 'models deleted successfully' });
  } catch (error) {
    console.error('Error deleting models:', error);
    return NextResponse.json(
      { error: 'Failed to delete models' },
      { status: 500 }
    );
  }
}
