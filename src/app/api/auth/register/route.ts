import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const userData = await request.json();
        
        const existingUser = await prisma.user.findUnique({
            where: { username: userData.username }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }
        
        const newUser = await prisma.user.create({
            data: {
                username: userData.username,
                password: userData.password,
                name: userData.name,
                role: userData.role || 'user',
                avatar: userData.avatar
            }
        });
        
        const { password: _, ...userWithoutPassword } = newUser;
        return NextResponse.json(userWithoutPassword);
        
    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
