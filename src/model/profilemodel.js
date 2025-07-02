const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// คำนวณอายุ
const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
};

const findEmployeeByIdCard = async (id_card) => {
  return prisma.persons.findUnique({
    where: { id_card },
    include: {
      education: true,
      address: true,
      employee: true,
    },
  });
};

const findInternByIdCard = async (id_card) => {
  return prisma.persons.findUnique({
    where: { id_card },
    include: {
      intern: true,
      address: true,
      family: {
        include: {
          parent_address: true,
        },
      },
      sibling: true,
    },
  });
};

const findAdminByIdCard = async (id_card) => {
  return prisma.persons.findUnique({
    where: { id_card },
  });
};

const findPersonByIdCard = async (idCard) => {
  return await prisma.persons.findUnique({
    where: { id_card: idCard },
  });
};

const updatePersonImage = async (idCard, imagePath) => {
  return await prisma.persons.update({
    where: { id_card: idCard },
    data: { image: imagePath },
  });
};

module.exports = {
  calculateAge,
  findEmployeeByIdCard,
  findInternByIdCard,
  findAdminByIdCard,
  updatePersonImage,
  findPersonByIdCard,
  prisma,
};
