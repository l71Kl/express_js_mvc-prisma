const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.findAllAdmins = async () => {
  return await prisma.login.findMany({
    where: {
      OR: [
        { is_admin: true },
        { is_super_admin: true }
      ]
    },
    select: {
      email: true,
      is_admin: true,
      is_super_admin: true,
      persons: {
        select: {
          name: true,
          last_name: true,
          nickname: true,
          birth_day: true
        }
      }
    }
  });
};

exports.findAlluser = async () => {
  return await prisma.login.findMany({
    where: {
      is_admin: false ,
      is_super_admin: false 
    },
    select: {
      email: true,
      is_admin: true,
      is_super_admin: true,
      persons: {
        select: {
          name: true,
          last_name: true,
          nickname: true,
          birth_day: true
        }
      }
    }
  });
};

exports.updateUserRole = async (email, is_admin, is_super_admin) => {
  return await prisma.login.update({
    where: { email },
    data: {
      is_admin: typeof is_admin === 'boolean' ? is_admin : undefined,
      is_super_admin: typeof is_super_admin === 'boolean' ? is_super_admin : undefined
    },
    select: {
      email: true,
      is_admin: true,
      is_super_admin: true
    }
  });
};