const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.isEmployee = async (idCard) => {
  const employee = await prisma.employee.findUnique({
    where: { id_card: idCard },
    select: { id_card: true }, // ดึงแค่ฟิลด์เดียวเพื่อประหยัด
  });
  return !!employee; // แปลงเป็น true/false
};

exports.isIntern = async (idCard) => {
  const intern = await prisma.intern.findUnique({
    where: { id_card: idCard },
    select: { id_card: true },
  });
  return !!intern;
};
