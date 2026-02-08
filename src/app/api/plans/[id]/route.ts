import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.plan.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const updates = await request.json();
    
    try {
        const updatedPlan = await prisma.plan.update({
            where: { id },
            data: updates
        });
        return NextResponse.json(updatedPlan);
    } catch (error) {
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
}
