import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.contact.deleteMany(); // Clean slate

  await prisma.contact.create({
    data: {
      email: 'lorraine@hillvalley.edu',
      phoneNumber: '123456',
      linkedPrecedence: 'primary',
    }
  });

  await prisma.contact.create({
    data: {
      email: 'mcfly@hillvalley.edu',
      phoneNumber: '123456',
      linkedPrecedence: 'secondary',
      linkedId: 1
    }
  });

  await prisma.contact.create({
    data: {
      email: 'biffsucks@hillvalley.edu',
      phoneNumber: '717171',
      linkedPrecedence: 'primary',
    }
  });

  await prisma.contact.create({
    data: {
      email: 'george@hillvalley.edu',
      phoneNumber: '919191',
      linkedPrecedence: 'primary',
    }
  });
}

main()
  .then(() => console.log("✅ Seeded DB"))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
