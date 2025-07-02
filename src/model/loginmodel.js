// model/loginmodel-prisma.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.checkIsAdmin = async (email) => {
  const user = await prisma.login.findUnique({
    where: { email },
    select: { is_admin: true , is_super_admin:true},
  });

  return !!(user && user.is_admin && user.is_super_admin);
};
exports.getUserByEmail = async (email) => {
  return await prisma.login.findUnique({
    where: { email },
  });
};