import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const stocksToSeed = [
  { symbol: 'AAPL', price: 175.50 },
  { symbol: 'MSFT', price: 405.20 },
  { symbol: 'GOOGL', price: 140.80 },
  { symbol: 'NVDA', price: 1100.00 },
  { symbol: 'AMZN', price: 180.60 },
  { symbol: 'TSLA', price: 230.15 },
  { symbol: 'META', price: 500.75 },
  { symbol: 'JPM', price: 195.90 },
  { symbol: 'V', price: 280.30 },
  { symbol: 'NFLX', price: 610.40 },
];

const usersToSeed = [
  {
    email: 'usuario1@example.com',
    password: 'password123',
    firstName: 'Juan',
    lastName: 'Pérez',
  },
  {
    email: 'usuario2@example.com',
    password: 'password123',
    firstName: 'María',
    lastName: 'González',
  },
  {
    email: 'usuario3@example.com',
    password: 'password123',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
  },
];

async function main() {
  console.log('Iniciando el Seeding de Usuarios...');
  
  // Borrar datos antiguos para empezar limpio (en orden: primero las que tienen foreign keys)
  console.log('Eliminando datos existentes...');
  
  const transactionCount = await prisma.transaction.deleteMany({});
  console.log(`  - Eliminadas ${transactionCount.count} transacciones`);
  
  const movementCount = await prisma.movement.deleteMany({});
  console.log(`  - Eliminados ${movementCount.count} movimientos`);
  
  const portfolioCount = await prisma.portfolio.deleteMany({});
  console.log(`  - Eliminados ${portfolioCount.count} portfolios`);
  
  const userCount = await prisma.user.deleteMany({});
  console.log(`  - Eliminados ${userCount.count} usuarios`);
  
  const stockCount = await prisma.stock.deleteMany({});
  console.log(`  - Eliminadas ${stockCount.count} stocks`);
  
  console.log('Datos eliminados correctamente.');
  
  // Crear stocks
  console.log('Creando stocks...');
  const stockPromises = stocksToSeed.map(stock =>
    prisma.stock.create({
      data: {
        symbol: stock.symbol,
        price: stock.price,
      },
    })
  );
  await Promise.all(stockPromises);
  console.log(`${stocksToSeed.length} stocks creados.`);
  
  // Crear usuarios y sus portfolios
  console.log('Creando usuarios y portfolios...');
  const userPromises = usersToSeed.map(async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });

    // Crear portfolio para cada usuario
    await prisma.portfolio.create({
      data: {
        name: `${user.firstName}'s Portfolio`,
        userId: user.id,
        stocksHeld: { "NVDA": 1 },
      },
    });

    return user;
  });

  await Promise.all(userPromises);
  console.log(`Seeding completado. ${stocksToSeed.length} stocks, ${usersToSeed.length} usuarios y portfolios añadidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });