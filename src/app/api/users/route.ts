import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const users = await prisma.user.findMany();
    // Return users without passwords
    const safeUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json(safeUsers);
}
