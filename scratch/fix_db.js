const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Enabling PostGIS extension...');
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('PostGIS extension enabled.');
  } catch (error) {
    console.error('Error enabling PostGIS:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
