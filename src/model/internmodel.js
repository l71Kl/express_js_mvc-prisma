// model/internmodel-prisma.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getFullInterns = async (excludeIdCard) => {
  return await prisma.persons.findMany({
    where: {
      // ดึงเฉพาะคนที่มี intern
      intern: {
        isNot: null, // หรือ is: { ... } ก็ได้ ถ้าอยากเจาะจงเงื่อนไขใน intern
      },
      ...(excludeIdCard ? { id_card: { not: excludeIdCard } } : {}),
    },
    include: {
      intern: true,
      address: true,
      family: {
        include: {
          parent_address: true  // ✅ include แบบ nested
        }
      },
      sibling: true,
    },
  });
  
};
