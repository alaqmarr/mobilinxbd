import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET all series OR filter by brandId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');

    const series = await prisma.series.findMany({
      where: brandId ? { brandId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        models: true,
        brand: true,
      },
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}

// POST → create series
export async function POST(request: Request) {
  try {
    const { name, image, brandId } = await request.json();

    if (!name || !brandId) {
      return NextResponse.json({ error: 'Name and brandId are required' }, { status: 400 });
    }

    const series = await prisma.series.create({
      data: { name, image, brandId },
    });

    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    console.error('Error creating series:', error);
    return NextResponse.json({ error: 'Failed to create series' }, { status: 500 });
  }
}
