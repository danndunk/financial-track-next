import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    const plans = await prisma.plan.findMany({ where: { userId } });
    return NextResponse.json(plans);
}

export async function POST(request: Request) {
    try {
        const planData = await request.json();
        const newPlan = await prisma.plan.create({
            data: planData
        });
        
        return NextResponse.json(newPlan);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
