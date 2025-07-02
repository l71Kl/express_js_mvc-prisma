const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findPersonByEmail = async (email) => {
    return await prisma.persons.findUnique({ where: { email } });
  };
  

exports.findLoginByEmail = async (email) => {
    return await prisma.login.findUnique({ where: { email } });
  };
  
exports.createLogin = async (email, hashedPassword) => {
    return await prisma.login.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
};

exports.updatePasswordByEmail = async (email, hashedPassword) => {
    return await prisma.login.update({
      where: { email },
      data: { password: hashedPassword },
    });
  };