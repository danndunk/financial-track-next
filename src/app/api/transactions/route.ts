import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');
    
    if (!userId) {
        return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    const whereClause: any = { userId };
    if (type && type !== 'all') {
        whereClause.type = type;
    }

    const transactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        take: limit ? Number(limit) : undefined
    });
    
    return NextResponse.json(transactions);
}

export async function POST(request: Request) {
    try {
        const txData = await request.json();
        
        // Use a transaction to ensure data integrity
        const newTx = await prisma.$transaction(async (tx) => {
            // 1. Create Transaction
            const createdTx = await tx.transaction.create({
                data: txData
            });

            // 2. Update Pocket Balance
            if (txData.pocketId) {
                const amount = txData.type === 'income' ? txData.amount : -txData.amount;
                await tx.pocket.update({
                    where: { id: txData.pocketId },
                    data: {
                        balance: { increment: amount }
                    }
                });
            }
            
            return createdTx;
        });
        
        return NextResponse.json(newTx);
    } catch (error) {
        console.error("Transaction Create Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
