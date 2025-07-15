import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, image } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: { name, image },
    });
    
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}