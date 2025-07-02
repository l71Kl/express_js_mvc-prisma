const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllNonAdminUsers = async () => {
  const users = await prisma.login.findMany({
    where: {
      is_admin: false,
      is_super_admin: false,
      persons: {
        // persons ต้องมีข้อมูล
        NOT: null,
      },
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
          birth_day: true,
        },
      },
    },
  });
}