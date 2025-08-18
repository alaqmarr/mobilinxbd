import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET all models OR filter by seriesId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesId = searchParams.get('seriesId');

    const models = await prisma.models.findMany({
      where: seriesId ? { seriesId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        series: true,
      },
    });

    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

// POST → create model
export async function POST(request: Request) {
  try {
    const { name, image, seriesId } = await request.json();

    if (!name || !seriesId) {
      return NextResponse.json({ error: 'Name and seriesId are required' }, { status: 400 });
    }

    const model = await prisma.models.create({
      data: { name, image, seriesId },
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}
