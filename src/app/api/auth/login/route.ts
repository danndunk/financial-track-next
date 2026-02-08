import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        
        const user = await prisma.user.findFirst({
            where: {
                username,
                password
            }
        });
        
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
        
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
