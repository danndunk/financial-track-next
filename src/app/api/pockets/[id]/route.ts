import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.pocket.delete({ where: { id } });
    return NextResponse.json({ success: true });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const updates = await request.json();
    
    try {
        const updatedPocket = await prisma.pocket.update({
            where: { id },
            data: updates
        });
        return NextResponse.json(updatedPocket);
    } catch (error) {
        return NextResponse.json({ error: 'Pocket not found' }, { status: 404 });
    }
}
