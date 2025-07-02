const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.insertPerson = (tx, person, imageUrl) => {
  return tx.persons.create({
    data: {
      position: person.position,
      name: person.name,
      last_name: person.last_name,
      nickname: person.nickname,
      name_eng: person.name_eng,
      last_name_eng: person.last_name_eng,
      id_card: person.id_card,
      issue_date: new Date(person.issue_date),
      expire_date: new Date(person.expire_date),
      birth_day: new Date(person.birth_day),
      birth_place: person.birth_place,
      height: person.height,
      weight: person.weight,
      nationality: person.nationality,
      religion: person.religion,
      phone: person.phone,
      home_phone: person.home_phone,
      office_phone: person.office_phone,
      sex: person.sex,
      sex_detail: person.sex === 'other' ? person.sex_detail : null,
      email: person.email,
      image: imageUrl,
      idcardplace: person.idcardplace,
    },
  });
};

exports.insertEducation = (tx, idCard, education) => {
  return tx.education.createMany({
    data: education.map((edu) => ({
      id_card: idCard,
      education_level: edu.education_level,
      major: edu.major,
      university: edu.university,
      gpa: edu.gpa,
      start_year: edu.start_year,
      end_year: edu.end_year,
    })),
    skipDuplicates: true,
  });
};

exports.insertAddress = (tx, idCard, addressList) => {
  return tx.address.createMany({
    data: addressList.map((addr) => ({
      id_card: idCard,
      house_number: addr.house_number,
      village_number: addr.village_number,
      alley: addr.alley,
      road: addr.road,
      subdistrict: addr.subdistrict,
      district: addr.district,
      province: addr.province,
      postal_code: addr.postal_code,
      house_type: addr.house_type,
      is_current_house: addr.is_current_house,
    })),
    skipDuplicates: true,
  });
};

exports.insertEmployee = (tx, idCard, employee) => {
  return tx.employee.create({
    data: {
      id_card: idCard,
      position: employee.position,
      start_date: new Date(employee.start_date),
      salary: employee.salary,
      military_status: employee.military_status,
      military_years: employee.military_years,
    },
  });
};
