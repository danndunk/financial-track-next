
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check and create 'user'
  const user = await prisma.user.findUnique({ where: { username: 'user' } });
  if (!user) {
    await prisma.user.create({
      data: {
        username: 'user',
        password: '123',
        name: 'Normal User',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        pockets: {
          create: [
             { name: 'Bank Mandiri', balance: 1200000, type: 'bank', color: '#3B82F6' },
             { name: 'Bank Jago', balance: 3000000, type: 'bank', color: '#F59E0B' },
             { name: 'Cash', balance: 500000, type: 'wallet', color: '#10B981' },
             { name: 'GoPay', balance: 250000, type: 'ewallet', color: '#0EA5E9' },
          ]
        }
      },
    });
    console.log("Created user: 'user' with password '123'");
  } else {
    console.log("User 'user' already exists.");
  }

  // Check and create 'admin'
  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!admin) {
    await prisma.user.create({
      data: {
        username: 'admin',
        password: '123',
        name: 'Administrator',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        pockets: {
          create: [
             { name: 'Vault', balance: 999999999, type: 'bank', color: '#6366F1' },
          ]
        }
      },
    });
    console.log("Created user: 'admin' with password '123'");
  } else {
    console.log("User 'admin' already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
