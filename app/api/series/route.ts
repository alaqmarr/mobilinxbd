import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const series = await prisma.series.findMany({
      include: {
        brand: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch series' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, brandId, image } = await request.json();
    
    if (!name || !brandId) {
      return NextResponse.json(
        { error: 'Series name and brand ID are required' },
        { status: 400 }
      );
    }

    const series = await prisma.series.create({
      data: { name, brandId, image },
      include: {
        brand: true,
      },
    });
    
    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    console.error('Error creating series:', error);
    return NextResponse.json(
      { error: 'Failed to create series' },
      { status: 500 }
    );
  }
}