import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const models = await prisma.models.findMany({
      include: {
        series: {
          include: {
            brand: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, seriesId, image } = await request.json();
    
    if (!name || !seriesId) {
      return NextResponse.json(
        { error: 'Model name and series ID are required' },
        { status: 400 }
      );
    }

    const model = await prisma.models.create({
      data: { name, seriesId, image },
      include: {
        series: {
          include: {
            brand: true,
          },
        },
      },
    });
    
    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
}