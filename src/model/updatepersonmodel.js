// models/personModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.updatePerson = async (id_card, updates) => {
    
     // ตรวจสอบว่าเป็นวันที่ที่แปลงได้จริง
  ['issue_date', 'expire_date', 'birth_day'].forEach((key) => {
    if (updates[key]) {
      const date = new Date(updates[key]);
      if (!isNaN(date.getTime())) {
        updates[key] = date;
      } else {
        delete updates[key]; // ลบค่าที่ไม่ใช่วันที่ออก
      }
    }
  });

   // แปลงความสูงและน้ำหนักเป็น Int
   ['height', 'weight'].forEach((key) => {
    if (updates[key]) {
      const parsed = parseInt(updates[key], 10);
      if (!isNaN(parsed)) {
        updates[key] = parsed;
      } else {
        delete updates[key]; // หรือโยน error ก็ได้
      }
    }
  });


  return prisma.persons.update({
    where: { id_card },
    data: updates,
  });
};


exports.updateEmployee = async (id_card, updates) => {

    ['start_date'].forEach((key) => {
        if (updates[key]) {
          const date = new Date(updates[key]);
          if (!isNaN(date)) {
            updates[key] = date;
          } else {
            delete updates[key]; // หรือ throw error ก็ได้
          }
        }
      });

  return prisma.employee.update({
    where: { id_card },
    data: updates,
  });
};


exports.upsertAddress = async (id_card, address) => {
  return prisma.address.upsert({
    where: {
      id_card_is_current_house: {
        id_card,
        is_current_house: address.is_current_house ?? false,
      }
    },
    update: address,
    create: {
      ...address,
      id_card,
    },
  });
};

exports.upsertEducation = async (id_card, education) => {
    return prisma.education.upsert({
      where: {
        id_card_education_level: {
          id_card,
          education_level: education.education_level,
        }
      },
      update: education,
      create: {
        ...education,
        id_card,
      },
    });
  };

exports.upsertFamily = async (id_card, updates) => {
    return prisma.family.upsert({
        where: { id_card },
        create: {
          id_card,
          ...updates,
        },
        update: {
          ...updates,
        },
      });
};

// exports.upsertIntern = async (id_card, updates) => {
//     ['start_date', 'end_date'].forEach((key) => {
//         if (updates[key]) {
//           const date = new Date(updates[key]);
//           if (!isNaN(date)) {
//             updates[key] = date;
//           } else {
//             delete updates[key]; 
//           }
//         }
//       });
//     return prisma.intern.upsert({
//         where: { id_card },
//     create: {
//       id_card,
//       ...updates,
//     },
//     update: {
//       ...updates,
//     },
//     });
// };

exports.upsertIntern = async (id_card, updates) => {
  ['start_date', 'end_date'].forEach((key) => {
    if (updates[key]) {
      const date = new Date(updates[key]);
      if (!isNaN(date)) {
        updates[key] = date;
      } else {
        delete updates[key];
      }
    }
  });

  const existing = await prisma.intern.findUnique({
    where: { id_card },
  });

  if (existing) {
    return prisma.intern.update({
      where: { id_card },
      data: updates,
    });
  } else {
    return prisma.intern.create({
      data: {
        ...updates,
        id_card,
        persons: {
          connect: { id_card }, // ✅ ต้องเชื่อมกับ persons เสมอ
        },
      },
    });
  }
};


// exports.upsertSibling = async (id_card, sibling) => {
//     return prisma.sibling.upsert({
//       where: {
//         id_card_sibling_id: {
//           id_card,
//           sibling_id: sibling.sibling_id,
//         }
//       },
//       update: sibling,
//       create: {
//         ...sibling,
//         id_card,
//       },
//     });
//   };
  exports.upsertSibling = async (id_card, sibling) => {
    const siblingIdInt = parseInt(sibling.sibling_id, 10);
  
    return prisma.sibling.upsert({
      where: {
        sibling_id: siblingIdInt,
      },
      update: {
        name: sibling.name,
        age: sibling.age !== undefined ? parseInt(sibling.age, 10) : null,
        occupation: sibling.occupation,
        id_card,  // ปกติไม่ควรแก้ id_card ใน update เพราะเป็น FK แต่ถ้าต้องการเปลี่ยนก็ใส่ไว้
      },
      create: {
        sibling_id: siblingIdInt,
        id_card,
        name: sibling.name,
        age: sibling.age !== undefined ? parseInt(sibling.age, 10) : null,
        occupation: sibling.occupation,
      },
    });
  };

  exports.upsertParentAddress = async (family_id, paddr) => {
    const { parent_type, ...rest } = paddr;
  
    if (!parent_type) {
      throw new Error('parent_type is required');
    }
  
    return prisma.parent_address.upsert({
      where: {
        family_id_parent_type: {
          family_id,
          parent_type
        }
      },
      update: rest,
      create: {
        ...rest,
        family_id,
        parent_type
      }
    });
  };
  

exports.getFamilyIdByIdCard = async (id_card) => {
    const result = await prisma.family.findUnique({
      where: { id_card },
      select: { family_id: true }
    });
  
    if (!result) {
      throw new Error(`ไม่พบ family สำหรับ id_card: ${id_card}`);
    }
  
    return result.family_id;
  };
  
