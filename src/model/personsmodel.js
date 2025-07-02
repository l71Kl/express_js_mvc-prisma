const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getIdCardByEmail(email) {
  const person = await prisma.persons.findUnique({
    where: { email },
    select: { id_card: true },
  });
  return person ? person.id_card : null;
}

async function getPersonByEmail(email) {
  return await prisma.persons.findUnique({
    where: { email },
  });
}

async function findAdminByEmail(email) {
  return await prisma.login.findUnique({ 
    where: { email },
    select: { is_admin: true },
  });
}

async function findIdCardByEmail(email) {
  const person = await prisma.persons.findUnique({
    where: { email },
    select: { id_card: true },
  });
  return person?.id_card || null;
}

async function fetchFullPersonData(excludeIdCard) {
  return await prisma.persons.findMany({
    where: {
      // ดึงเฉพาะคนที่มี employee
      employee: {
        isNot: null, // หรือ is: { ... } ก็ได้ ถ้าอยากเจาะจงเงื่อนไขใน employee
      },
      ...(excludeIdCard ? { id_card: { not: excludeIdCard } } : {}),
    },
    include: {
      education: true,
      address: true,
      employee: true,
    },
  });
}

module.exports = {
  getIdCardByEmail,
  getPersonByEmail,
  findAdminByEmail,
  findIdCardByEmail,
  fetchFullPersonData,
};
