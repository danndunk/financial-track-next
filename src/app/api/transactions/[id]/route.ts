import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    try {
        await prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.findUnique({ where: { id } });
            if (!transaction) throw new Error("Transaction not found");

            // Revert pocket balance
            if (transaction.pocketId) {
                const amount = transaction.type === 'income' ? -transaction.amount : transaction.amount;
                await tx.pocket.update({
                    where: { id: transaction.pocketId },
                    data: { balance: { increment: amount } }
                });
            }

            await tx.transaction.delete({ where: { id } });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const updates = await request.json();
    
    try {
        const updatedTx = await prisma.$transaction(async (tx) => {
            const oldTx = await tx.transaction.findUnique({ where: { id } });
            if (!oldTx) throw new Error("Transaction not found");

            // 1. Revert old balance effect
            if (oldTx.pocketId) {
                const oldAmount = oldTx.type === 'income' ? -oldTx.amount : oldTx.amount;
                await tx.pocket.update({
                    where: { id: oldTx.pocketId },
                    data: { balance: { increment: oldAmount } }
                });
            }

            // 2. Apply new balance effect (using updated values or falling back to old ones)
            // Note: If updates doesn't contain amount/type/pocketId, we use oldTx values.
            // But usually updates comes from client with full or partial data.
            // Let's assume we merge logic carefully.
            
            const newTxData = { ...oldTx, ...updates };
            
            if (newTxData.pocketId) {
                const newAmount = newTxData.type === 'income' ? newTxData.amount : -newTxData.amount;
                await tx.pocket.update({
                    where: { id: newTxData.pocketId },
                    data: { balance: { increment: newAmount } }
                });
            }

            return await tx.transaction.update({
                where: { id },
                data: updates
            });
        });

        return NextResponse.json(updatedTx);
    } catch (error) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
}
