import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    const userPockets = await prisma.pocket.findMany({ where: { userId } });
    return NextResponse.json(userPockets);
}

export async function POST(request: Request) {
    try {
        const pocketData = await request.json();
        const newPocket = await prisma.pocket.create({
            data: pocketData
        });
        
        return NextResponse.json(newPocket);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
