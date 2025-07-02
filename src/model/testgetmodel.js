// modelprisma/testgetModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTestgetData = async () => {
  try {
    const data = await prisma.testget.findMany();
    return data;
  } catch (error) {
    console.error('Prisma error:', error);
    throw error;
  }
};
