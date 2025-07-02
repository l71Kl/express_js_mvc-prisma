const personModel = require('../model/addpersonmodel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function mapEducationLevel(thaiLevel) {
  const map = {
    "มัธยมศึกษา": "HIGH_SCHOOL",
    "ปวช.": "VOCATIONAL",
    "ปวส.": "HIGHER_VOC",
    "ป.ตรี": "BACHELOR",
    "ป.โท": "MASTER",
    "ป.เอก": "DOCTORATE"
  };
  return map[thaiLevel] || null;
}


function convertFieldsToInt(obj, fields) {
  fields.forEach((field) => {
    if (obj[field] !== undefined) {
      const val = parseInt(obj[field], 10);
      if (!isNaN(val)) {
        obj[field] = val;
      } else {
        delete obj[field]; // หรือตั้งค่าเป็น null ก็ได้ตาม schema
      }
    }
  });
}

exports.addFullPersonInfoService = async (parsedData, imageUrl) => {
  const { person, education, address, employee } = parsedData;

  if (!Array.isArray(address)) {
    throw { code: 'ADDRESS_INVALID' };
  }

  const registeredAddress = address.find(a => a.type === 'registered');
  if (!registeredAddress) {
    throw { code: 'REGISTERED_ADDRESS_MISSING' };
  }

  address.forEach(addr => {
    convertFieldsToInt(addr, ['village_number']);
  });

  if (employee) {
    convertFieldsToInt(employee, ['salary', 'military_years']);
  }

  return await prisma.$transaction(async (tx) => {
    let transformedEducation = [];
    if (Array.isArray(education)) {
      education.forEach(edu => {
        convertFieldsToInt(edu, ['start_year', 'end_year']);
      });
      transformedEducation = education.map(edu => ({
        ...edu,
        education_level: mapEducationLevel(edu.education_level)
      }));
    }

    await personModel.insertPerson(tx, person, imageUrl);

    if (transformedEducation.length > 0) {
      await personModel.insertEducation(tx, person.id_card, transformedEducation);
    }

    await personModel.insertAddress(tx, person.id_card, address);

    if (employee) {
      await personModel.insertEmployee(tx, person.id_card, employee);
    }

    return { message: 'All data inserted.' };
  });
};
