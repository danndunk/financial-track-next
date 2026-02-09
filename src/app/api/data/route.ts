import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    try {
        const [pockets, transactions, plans] = await Promise.all([
            prisma.pocket.findMany({ where: { userId } }),
            prisma.transaction.findMany({ 
                where: { userId },
                orderBy: { date: 'desc' }
            }),
            prisma.plan.findMany({ where: { userId } })
        ]);
        
        return NextResponse.json({
            pockets,
            transactions,
            plans
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
