const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@example.com';
  const password = await bcrypt.hash('admin123', 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email },
      update: { role: 'ADMIN' },
      create: { 
        email, 
        password,
        role: 'ADMIN'
      }
    });
    console.log('Admin user ready:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
