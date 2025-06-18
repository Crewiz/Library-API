import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  // Läs in json-example
  const raw = readFileSync(join(__dirname, '../src/data/example.json'), 'utf-8');
  const { books } = JSON.parse(raw);

  // rensa existerande data
  await prisma.rental.deleteMany();
  await prisma.book.deleteMany();

  // Seed books
  for (const b of books) {
    await prisma.book.create({ data: b });
  }

  console.log(`Seeded ${books.length} books`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
