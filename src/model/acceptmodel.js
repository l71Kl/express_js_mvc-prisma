const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.updateIsAccept = async (id_card, is_accept) => {
    return await prisma.persons.update({
      where: { id_card },
      data: { is_accept },
    });
  };
  
exports.findEmailAndName = async (id_card) => {
    return await prisma.persons.findUnique({
      where: { id_card },
      select: { email: true, name: true },
    });
  };
  