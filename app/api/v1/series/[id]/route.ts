import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET → Fetch series by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const series = await prisma.series.findUnique({
      where: { id: (await params).id },
      include: {
        models: true,
        brand: true,
      },
    });

    if (!series) {
      return NextResponse.json(
        { error: 'series not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
}

// PUT → Update series by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    const { name, image } = await request.json();

    const updated = await prisma.series.update({
      where: { id: (await params).id },
      data: { name, image },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json(
      { error: 'Failed to update series' },
      { status: 500 }
    );
  }
}

// DELETE → Delete series by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{id:string}> }
) {
  try {
    await prisma.series.delete({
      where: { id: (await params).id },
    });

    return NextResponse.json({ message: 'series deleted successfully' });
  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json(
      { error: 'Failed to delete series' },
      { status: 500 }
    );
  }
}
